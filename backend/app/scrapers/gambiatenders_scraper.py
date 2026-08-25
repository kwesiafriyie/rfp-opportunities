"""Scrapes gambiatenders.com's tender listing pages.

Custom (non-WordPress) tender aggregator. The listing gives only a title per
card -- no excerpt/body -- so keyword matching runs on the title alone here
(unlike thepoint.gm, this site is already scoped to tenders/procurement
specifically, not general news, so a title-only match is a reasonable
trade-off against fetching every candidate's detail page).
"""
import logging
import re
from typing import Dict, List
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from .date_utils import parse_deadline

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15
LISTING_PATH = "/tenders.php"
MAX_PAGES = 3

# Each card shows a "Deadline: DD Mon YYYY" (or "Deadline: YYYY-MM-DD") line
# next to a clock icon.
_DEADLINE_RE = re.compile(
    r"deadline\s*:?\s*(\d{1,2}\s+[A-Za-z]+\.?\s+\d{4}|\d{4}-\d{2}-\d{2})", re.IGNORECASE
)


def fetch_posts(base_url: str, max_pages: int = MAX_PAGES) -> List[Dict]:
    candidates: List[Dict] = []
    url = f"{base_url}{LISTING_PATH}"

    for page in range(1, max_pages + 1):
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.select("div.tender-card")
        if not cards:
            break

        for card in cards:
            heading = card.select_one(".tender-card-heading")
            link_el = card.select_one("a[href]")
            if not heading or not link_el:
                continue

            deadline_match = _DEADLINE_RE.search(card.get_text(" ", strip=True))
            deadline = parse_deadline(deadline_match.group(1)) if deadline_match else None

            candidates.append({
                "title": heading.get_text(strip=True),
                "link": urljoin(base_url, link_el["href"]),
                "published_at": None,
                "deadline": deadline,
            })

        next_link = soup.select_one('a[rel="next"]')
        if not next_link or not next_link.get("href"):
            break
        url = urljoin(base_url, next_link["href"])

    # De-dupe (a tender's heading link and its "View Details" link both match).
    seen = set()
    unique_candidates = []
    for c in candidates:
        if c["link"] in seen:
            continue
        seen.add(c["link"])
        unique_candidates.append(c)

    return unique_candidates
