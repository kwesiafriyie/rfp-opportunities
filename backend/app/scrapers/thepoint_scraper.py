"""Scrapes thepoint.gm's "Advertisements" category listing page directly.

thepoint.gm is a custom-built (non-WordPress) site. Its RSS feed is scoped to
"Headlines" only and doesn't include this category (confirmed by fetching
it), so there's no structured-data shortcut here -- this scrapes the HTML.

The listing page only gives a title and date per card, not body text. That's
not enough on its own: a real example notice here was titled just "VACANCY
ANNOUNCEMENT", with all the actual EOI/consultancy wording in the article
body. So for every candidate within the lookback window, this also fetches
the individual article page and pulls its body text for keyword matching.
"""
import logging
import re
from datetime import datetime, timedelta, timezone
from html import unescape
from typing import Dict, List, Optional
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15
LOOKBACK_DAYS = 730
MAX_PAGES = 5
CATEGORY_PATH = "/technology"  # thepoint.gm's URL slug for its "Advertisements" section

_DATE_RE = re.compile(r"\b([A-Z][a-z]{2} \d{1,2}, \d{4})\b")


def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    return unescape(re.sub(r"\s+", " ", text)).strip()


def _extract_date(text: str) -> Optional[datetime]:
    match = _DATE_RE.search(text)
    if not match:
        return None
    try:
        return datetime.strptime(match.group(1), "%b %d, %Y").replace(tzinfo=timezone.utc)
    except ValueError:
        return None


def _fetch_article_body(link: str) -> str:
    try:
        resp = requests.get(link, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.warning(f"Failed to fetch article {link}: {e}")
        return ""

    soup = BeautifulSoup(resp.text, "html.parser")
    content = soup.select_one(".article-content")
    return _strip_html(str(content))[:500] if content else ""


def fetch_posts(base_url: str) -> List[Dict]:
    cutoff = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)
    candidates: List[Dict] = []
    url = f"{base_url}{CATEGORY_PATH}"

    for _ in range(MAX_PAGES):
        try:
            resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch {url}: {e}")
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        # Every real story card (lead, ranked list, and the "More in section"
        # grid) is an <a> linking into this category with a heading inside.
        # Matched by structure, not Tailwind class names, since those churn
        # with theme updates.
        cards = soup.select(f'a[href^="{CATEGORY_PATH}/"]')

        page_had_recent = False
        for card in cards:
            title_el = card.find(["h1", "h2", "h3"])
            href = card.get("href")
            if not title_el or not href:
                continue

            published_at = _extract_date(card.get_text(" ", strip=True))
            if published_at and published_at < cutoff:
                continue

            page_had_recent = True
            candidates.append({
                "title": title_el.get_text(strip=True),
                "link": urljoin(base_url, href),
                "published_at": published_at,
            })

        if not page_had_recent:
            break

        next_link = next(
            (a for a in soup.select('nav[aria-label="Pagination"] a') if "next" in a.get_text(strip=True).lower()),
            None,
        )
        if not next_link or not next_link.get("href"):
            break
        url = urljoin(base_url, next_link["href"])

    # De-dupe (the lead story reappears in "Most Read" etc.)
    seen = set()
    unique_candidates = []
    for c in candidates:
        if c["link"] in seen:
            continue
        seen.add(c["link"])
        unique_candidates.append(c)

    for c in unique_candidates:
        c["excerpt"] = _fetch_article_body(c["link"])

    return unique_candidates
