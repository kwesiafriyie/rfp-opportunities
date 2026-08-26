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
PAGE_SIZE = 50
MAX_PAGES = 10

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


def fetch_posts(base_url: str) -> List[Dict]:
    today = datetime.now(timezone.utc).strftime("%d-%b-%Y")
    url = f"{base_url}{SEARCH_PATH}"
    headers = {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    }

    candidates: List[Dict] = []
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
            if post:
                candidates.append(post)

        if len(rows) < PAGE_SIZE:
            break

    return candidates
