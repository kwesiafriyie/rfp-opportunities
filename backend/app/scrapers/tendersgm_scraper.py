"""Scrapes tenders.gm's tender listing page.

Custom (Next.js) site, but server-rendered -- the tender cards are present in
the raw HTML, no browser automation needed. The listing page mixes open and
closed tenders together (open first, then a "Closed tenders" divider); this
only keeps the open ones, since expired notices aren't actionable.

Only the most recent ~12 tenders are server-rendered on this page with no
confirmed pagination mechanism (older ones are behind a "Browse closed
tenders" link requiring login) -- fine for a daily scrape, since it's the
newest listings that matter.
"""
import logging
from typing import Dict, List
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15
LISTING_PATH = "/tenders"


def fetch_posts(base_url: str) -> List[Dict]:
    url = f"{base_url}{LISTING_PATH}"

    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.warning(f"Failed to fetch {url}: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    candidates: List[Dict] = []

    for card in soup.select("article.tender-card"):
        title_link = card.select_one("h3 a[href]")
        if not title_link:
            continue

        closing_p = card.select_one("div.mt-auto > p")
        if closing_p and closing_p.get_text(strip=True).startswith("Closed:"):
            continue  # skip expired tenders

        category_el = card.select_one("span.bg-success-soft")
        org_el = card.select_one("p svg + span")
        desc_el = card.select_one("p.line-clamp-3")

        title = title_link.get_text(strip=True)
        excerpt_parts = [
            category_el.get_text(strip=True) if category_el else "",
            org_el.get_text(strip=True) if org_el else "",
            desc_el.get_text(strip=True) if desc_el else "",
        ]

        candidates.append({
            "title": title,
            "link": urljoin(base_url, title_link["href"]),
            "excerpt": " ".join(p for p in excerpt_parts if p)[:500],
            "published_at": None,
        })

    return candidates
