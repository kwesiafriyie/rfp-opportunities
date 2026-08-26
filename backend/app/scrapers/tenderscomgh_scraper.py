"""Scrapes TENDERS.com.gh's tender listing pages (/tenders/lists).

Custom (CodeIgniter) site, server-rendered HTML, no browser automation
needed. Each card carries a procurement-type badge ("Expression of
Interest", "Request for Proposal", "Invitation for Tenders", "Invitation
for Bids", ...) alongside the title, organization, and site-defined
categories (one of which is literally "Consultancy"). All of that is
folded into the excerpt so the keyword filter has real signal to work
with -- a title like "Provision of Technical Services" wouldn't match
anything on its own, but tagged "Request for Proposal" it does, since
that phrase is already in the keyword list (matching the same reasoning
used for Ghana PPA's EOI/RFP pages: those procurement instruments are
themselves markers of a consulting engagement).
"""
import logging
from typing import Dict, List, Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from .date_utils import parse_deadline

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15
LISTING_PATH = "/tenders/lists"
MAX_PAGES = 5


def _parse_box(box, base_url: str) -> Optional[Dict]:
    title_el = box.select_one("h4.title-header a")
    if not title_el or not title_el.get("href"):
        return None

    org = None
    categories: List[str] = []
    for breadcrumb in box.select("div.custom-breadcrumb"):
        icon = breadcrumb.select_one("i")
        if not icon:
            continue
        icon_classes = icon.get("class") or []
        if "fa-building" in icon_classes:
            span = breadcrumb.select_one("span")
            if span:
                org = span.get_text(strip=True)
        elif "fa-tags" in icon_classes:
            categories = [a.get_text(strip=True) for a in breadcrumb.select("span a")]

    pub_el = box.select_one("span.text-success")
    deadline_el = box.select_one("span.text-danger")
    published_at = parse_deadline(pub_el.get_text(strip=True).replace("\xa0", " ")) if pub_el else None
    deadline = parse_deadline(deadline_el.get_text(strip=True).replace("\xa0", " ")) if deadline_el else None

    type_el = box.select_one("a.btn-type")
    tender_type = type_el.get_text(strip=True) if type_el else ""

    excerpt = " | ".join(p for p in [org or "", ", ".join(categories), tender_type] if p)[:500]

    return {
        "title": title_el.get_text(strip=True),
        "link": urljoin(f"{base_url}/", title_el["href"]),
        "excerpt": excerpt or None,
        "published_at": published_at,
        "deadline": deadline,
    }


def fetch_posts(base_url: str, max_pages: int = MAX_PAGES) -> List[Dict]:
    candidates: List[Dict] = []
    url = f"{base_url}{LISTING_PATH}"

    for _ in range(max_pages):
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        boxes = soup.select("div.box")
        if not boxes:
            break

        for box in boxes:
            post = _parse_box(box, base_url)
            if post:
                candidates.append(post)

        next_link = soup.select_one('a[rel="next"]')
        if not next_link or not next_link.get("href"):
            break
        href = next_link["href"]
        url = href if href.startswith("http") else urljoin(f"{base_url}/", href)

    # A featured tender is pinned at the top of every page, so it'd
    # otherwise show up once per page scraped.
    seen = set()
    unique_candidates = []
    for c in candidates:
        if c["link"] in seen:
            continue
        seen.add(c["link"])
        unique_candidates.append(c)

    return unique_candidates
