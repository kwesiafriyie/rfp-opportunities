"""Scrapes the UN Global Marketplace's (UNGM) procurement notice search.

UNGM's public search page (/Public/Notice) is server-rendered HTML with no
Cloudflare or similar bot-wall -- confirmed with a plain, cookie-free curl.
Its search runs on a JSON POST endpoint (/Public/Notice/Search) that any
backend can call directly; reverse-engineered from a live capture of the
page's own request. The endpoint returns server-rendered HTML row fragments
(not JSON data), so this still parses HTML, just from a POST response
instead of a GET page.

Filtered at the source to just the consulting-relevant notice types
(mirroring the same "use the platform's own procurement-instrument
categories" approach already used for Ghana PPA and AfDB) rather than
pulling every UNGM notice type and relying entirely on the keyword filter --
UNGM's own type taxonomy is more precise than we could get from keywords
alone, since it also covers goods/works types (Invitation to Bid, Request
for Quotation, ...) we deliberately don't want.

Not scoped to any particular UN agency -- this pulls consulting-relevant
notices across the whole UN system (UNDP, FAO, UNICEF, WFP, AfDB, etc.),
whichever agencies currently have matching notices open.
"""
import logging
import re
from datetime import datetime, timezone
from typing import Dict, List, Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from ..core.normalize import parse_deadline_with_offset

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 20
SEARCH_PATH = "/Public/Notice/Search"
NOTICE_PATH = "/Public/Notice"
POPUP_PATH = "/Public/Notice/Popup"
PAGE_SIZE = 50
MAX_PAGES = 10

# The search listing has no description field at all -- only the detail
# "popup" endpoint (the same partial UNGM's own site fetches via AJAX for its
# in-page preview) has it, along with documents/links, contacts, and
# eligibility-flavored fields. That's one extra request per notice, so cap
# how many we do per scrape; anything beyond the cap just keeps the
# metadata-only excerpt built in _parse_row rather than failing the scrape.
MAX_DETAIL_FETCHES = 150

# The consulting-relevant procurement instruments among UNGM's notice types
# (excludes goods/works-flavored ones like Invitation to Bid, Request for
# Quotation, Request for Pre-Qualification).
NOTICE_TYPES = ["RequestForEoi", "RequestForProposal", "IndividualConsultant"]

_OFFSET_PART_RE = re.compile(r"\(GMT[^)]*\)", re.IGNORECASE)


def _split_deadline_text(raw: str) -> tuple[str, Optional[str]]:
    """UNGM shows a deadline as one text blob, e.g.
    "26-Aug-2026 04:30 (GMT -4.00)" -- split into the date/time part and the
    offset part so they can be parsed together.
    """
    match = _OFFSET_PART_RE.search(raw)
    if not match:
        return raw.strip(), None
    return raw[: match.start()].strip(), match.group(0)


def _parse_row(row, base_url: str) -> Optional[Dict]:
    notice_id = row.get("data-noticeid")
    title_el = row.select_one(".resultTitle .ungm-title")
    if not notice_id or not title_el:
        return None

    title = title_el.get_text(strip=True)
    link = urljoin(base_url, f"{NOTICE_PATH}/{notice_id}")

    deadline = None
    deadline_raw = None
    deadline_cell = row.select_one(".resultInfo1.deadline")
    if deadline_cell:
        spans = deadline_cell.select("span")
        if spans:
            deadline_raw = re.sub(r"\s+", " ", spans[0].get_text()).strip()
            date_part, offset_part = _split_deadline_text(deadline_raw)
            deadline = parse_deadline_with_offset(date_part, offset_part)

    reference_el = row.select_one('[data-description="Reference"] span')
    organization_el = row.select_one(".resultAgency span")
    type_label_el = row.select_one("label")

    # Published date and country are the two unlabeled cells in the row;
    # positionally consistent across every notice observed, but this is
    # defensive rather than load-bearing -- a missing/reordered cell just
    # yields a null field, never a crash.
    plain_cells = [
        c for c in row.select("div.tableCell")
        if not any(cls in (c.get("class") or []) for cls in
                    ("resultOptions", "resultTitle", "resultInfo1", "resultAgency"))
    ]
    published_at = None
    country = None
    if plain_cells:
        published_text = plain_cells[0].get_text(strip=True)
        if published_text:
            from dateutil import parser as date_parser
            try:
                published_at = date_parser.parse(published_text, fuzzy=True).replace(tzinfo=timezone.utc)
            except (ValueError, OverflowError, TypeError):
                published_at = None
        if len(plain_cells) > 1:
            country = plain_cells[-1].get_text(strip=True) or None

    organization = organization_el.get_text(strip=True) if organization_el else None
    reference = reference_el.get_text(strip=True) if reference_el else None
    notice_type = type_label_el.get_text(strip=True) if type_label_el else None

    excerpt_parts = [organization or "", notice_type or "", country or ""]
    excerpt = " | ".join(p for p in excerpt_parts if p) or None

    return {
        "title": title,
        "link": link,
        "excerpt": excerpt,
        "published_at": published_at,
        "deadline": deadline,
        "deadline_raw": deadline_raw,
        "organization": organization,
        "country": country,
        "reference": reference,
        "opportunity_type": notice_type,
    }


def _html_to_text(html: str) -> Optional[str]:
    """Convert a UNGM description fragment's nested div/br markup into plain
    text with paragraph breaks preserved -- never raw HTML, so the frontend
    can keep rendering it as plain text (whitespace-pre-line) rather than
    needing dangerouslySetInnerHTML.
    """
    if not html:
        return None
    soup = BeautifulSoup(html, "html.parser")
    for br in soup.find_all("br"):
        br.replace_with("\n")
    for block in soup.find_all(["div", "p", "li", "tr"]):
        block.append("\n")
    text = soup.get_text()
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()
    return text or None


def _extract_description(soup: BeautifulSoup) -> Optional[str]:
    for item in soup.select(".ungm-list-item.ungm-background"):
        title_el = item.select_one(".title")
        if title_el and title_el.get_text(strip=True).lower() == "description":
            children = item.find_all("div", recursive=False)
            if len(children) >= 2:
                return _html_to_text(str(children[1]))
    return None


def _extract_labeled_row(soup: BeautifulSoup, label_text: str) -> Optional[str]:
    for row in soup.select(".row"):
        label_el = row.select_one(".label")
        if label_el and label_text.lower() in label_el.get_text(strip=True).lower():
            value_el = row.select_one(".value")
            return value_el.get_text(strip=True) if value_el else None
    return None


def _extract_contact_info(soup: BeautifulSoup) -> Optional[str]:
    lines = []
    seen_values = set()
    for row in soup.select("#contactDetails .row"):
        label_el = row.select_one(".label")
        value_el = row.select_one(".value")
        if not label_el or not value_el:
            continue
        label = label_el.get_text(strip=True).rstrip(":")
        value = value_el.get_text(strip=True)
        if not value or value in seen_values:
            continue
        seen_values.add(value)
        lines.append(f"{label}: {value}")
    return "\n".join(lines) if lines else None


def _extract_documents(soup: BeautifulSoup) -> List[Dict]:
    """UNGM's "Links" tab -- always links out to the source (UNDP's own
    procurement system, sharepoint, etc.), never a file hosted by UNGM
    itself. We surface these the same way: link out, never fetch/host them.
    """
    docs = []
    for row in soup.select("#tblLinks tbody tr"):
        cells = row.select("td")
        if len(cells) < 2:
            continue
        url = cells[0].get_text(strip=True)
        label = cells[1].get_text(strip=True) or url
        if url:
            docs.append({"label": label, "url": url})
    return docs


def _extract_unspsc_category(soup: BeautifulSoup) -> Optional[str]:
    """Best-effort: UNGM renders the *entire* UNSPSC tree for context, with
    only the notice's actual category chain marked "expanded" (siblings and
    unrelated branches aren't). The deepest node in that chain -- the last
    ".expanded" match in document order -- is the notice's specific category.
    """
    nodes = soup.select(".unspscNode > .nodeName.expanded")
    if not nodes:
        return None
    parts = [
        s.get_text(strip=True) for s in nodes[-1].select(".floatLeft")
        if s.get_text(strip=True) and s.get_text(strip=True) != "-"
    ]
    return " - ".join(parts) if parts else None


def _fetch_detail(notice_id: str, base_url: str) -> Dict:
    url = f"{base_url}{POPUP_PATH}/{notice_id}"
    headers = {
        "User-Agent": USER_AGENT,
        "X-Requested-With": "XMLHttpRequest",
        "Referer": f"{base_url}{NOTICE_PATH}",
    }
    try:
        resp = requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.warning(f"Failed to fetch UNGM notice detail {notice_id}: {e}")
        return {}

    soup = BeautifulSoup(resp.text, "html.parser")
    registration_level = _extract_labeled_row(soup, "Registration level")
    unspsc_category = _extract_unspsc_category(soup)

    return {
        "description": _extract_description(soup),
        "documents": _extract_documents(soup),
        "contact_info": _extract_contact_info(soup),
        "eligibility": f"Registration level: {registration_level}" if registration_level else None,
        "extra": [{"label": "UNSPSC Category", "value": unspsc_category}] if unspsc_category else None,
    }


def fetch_posts(base_url: str) -> List[Dict]:
    today = datetime.now(timezone.utc).strftime("%d-%b-%Y")
    url = f"{base_url}{SEARCH_PATH}"
    headers = {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    }

    candidates: List[Dict] = []
    detail_fetch_count = 0
    for page_index in range(MAX_PAGES):
        payload = {
            "PageIndex": page_index,
            "PageSize": PAGE_SIZE,
            "Title": "",
            "Description": "",
            "Reference": "",
            "PublishedFrom": "",
            "PublishedTo": today,
            "DeadlineFrom": today,
            "DeadlineTo": "",
            "Agencies": [],
            "Countries": [],
            "IsActive": True,
            "IsSustainable": False,
            "NoticeDisplayType": None,
            "NoticeSearchTotalLabelId": "noticeSearchTotal",
            "NoticeTypes": NOTICE_TYPES,
            "SortAscending": True,
            "SortField": "Deadline",
            "TypeOfCompetitions": [],
            "UNSPSCs": [],
            "isPicker": False,
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch UNGM notices (page {page_index}): {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        rows = soup.select("div.tableRow.dataRow")
        if not rows:
            break

        for row in rows:
            post = _parse_row(row, base_url)
            if not post:
                continue

            notice_id = row.get("data-noticeid")
            if notice_id and detail_fetch_count < MAX_DETAIL_FETCHES:
                detail_fetch_count += 1
                for key, value in _fetch_detail(notice_id, base_url).items():
                    if value:
                        post[key] = value

            candidates.append(post)

        if len(rows) < PAGE_SIZE:
            break

    return candidates
