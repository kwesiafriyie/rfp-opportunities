"""Scrapes Ghana PPA's (Public Procurement Authority) EOI and RFP listing
pages (tenders.ppa.gov.gh/eois and tenders.ppa.gov.gh/tenders).

Plain server-rendered HTML, no browser automation needed. Both pages share
identical markup -- only the URL path differs -- so this scrapes both and
merges the results under a single logical source, rather than splitting
into two separate sources for what's really one procurement portal.

Selectors are ported from an earlier version of this scraper that was
verified working against the live site. tenders.ppa.gov.gh was
unreachable (network-level, not a bot block) when this was ported over,
so they couldn't be re-verified against current markup -- if the site has
changed, this will just quietly return fewer/no results (every failure
here is caught and logged, never raised) rather than break the pipeline.
"""
import logging
from typing import Dict, List
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

from .date_utils import parse_deadline

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15
MAX_PAGES = 5
LISTING_PATHS = ["/eois", "/tenders"]

LIST_SELECTOR = "div.list-wrap"
TITLE_SELECTOR = "div.list-agency"
DATE_SELECTOR = "div.list-date"
DESC_SELECTOR = "div.list-desc"
NEXT_SELECTOR = "a.page-link[rel='next']"


def _fetch_listing(base_url: str, listing_path: str) -> List[Dict]:
    candidates: List[Dict] = []
    url = f"{base_url}{listing_path}"

    for _ in range(MAX_PAGES):
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        listings = soup.select(LIST_SELECTOR)
        if not listings:
            break

        for listing in listings:
            title_el = listing.select_one(TITLE_SELECTOR)
            date_el = listing.select_one(DATE_SELECTOR)
            desc_el = listing.select_one(DESC_SELECTOR)
            link_el = listing.select_one("a[href]")

            if not title_el or not date_el or not link_el:
                continue

            # The date block holds two lines: a posted date, then a
            # "Deadline : ..." line.
            date_lines = [line.strip() for line in date_el.get_text("\n").split("\n") if line.strip()]
            if len(date_lines) < 2 or "deadline" not in date_lines[1].lower():
                continue
            posted_line, deadline_line = date_lines[0], date_lines[1]

            candidates.append({
                "title": title_el.get_text(strip=True),
                "link": urljoin(f"{base_url}/", link_el["href"]),
                "excerpt": desc_el.get_text(strip=True) if desc_el else None,
                "published_at": parse_deadline(posted_line),
                "deadline": parse_deadline(deadline_line.split(":", 1)[-1]),
            })

        next_link = soup.select_one(NEXT_SELECTOR)
        if not next_link or not next_link.get("href"):
            break
        href = next_link["href"]
        url = href if href.startswith("http") else urljoin(f"{base_url}/", href)

    return candidates


def fetch_posts(base_url: str) -> List[Dict]:
    posts: List[Dict] = []
    for path in LISTING_PATHS:
        posts.extend(_fetch_listing(base_url, path))
    return posts
