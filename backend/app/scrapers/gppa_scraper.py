"""Scrapes GPPA's (Gambia Public Procurement Authority) public Strapi API.

gppa.gm's tender listing (/tenders/notices) is a client-side-rendered
Next.js page with no data in the server-rendered HTML -- the real data
comes from a separate CMS at cms.gppa.gm, found by inspecting the page's
own network requests in a browser. The bearer token below is not a private
credential of ours: it's the same public, read-only token GPPA's own
frontend JS bundle embeds for anyone visiting the page, used here to call
the exact same public endpoint their site calls to render the page. It may
rotate or break at any time; this scraper fails gracefully (logs a
warning, returns []) if it does.

Only currently-open tenders are kept (skips awarded/closed/cancelled
notices, mirroring the "no closed tenders" filtering used for tenders.gm).
"""
import logging
from datetime import datetime, timezone
from typing import Dict, List

import requests

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 20
API_URL = "https://cms.gppa.gm/api/tenders"
PUBLIC_API_TOKEN = (
    "a6d20c7cef04198106337bc146673e67579f5ff0b72bc25f269cf443a71920fefa7b8ecd4ac601cc1a75b8e6b8ddde277947e"
    "eb16709cbfd57ba20f9e4ed53d8f47e4aa76696c46c8dc83df0e89f9aef8a08041a8c6c21159c540ecd0a7b99c05d7b4dc54c9"
    "76dd30d6bd8492674b2038884fc0b6f5d57ba065eb5654af80460"
)
CLOSED_STATUSES = {"awarded", "closed", "cancelled"}


def fetch_posts(base_url: str) -> List[Dict]:
    try:
        resp = requests.get(
            API_URL,
            params={"populate": "procuringEntity", "pagination[pageSize]": 100},
            headers={"User-Agent": USER_AGENT, "Authorization": f"Bearer {PUBLIC_API_TOKEN}"},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        payload = resp.json()
    except (requests.RequestException, ValueError) as e:
        logger.warning(f"Failed to fetch GPPA tenders: {e}")
        return []

    posts: List[Dict] = []
    for item in payload.get("data", []):
        if item.get("tenderStatus") in CLOSED_STATUSES:
            continue

        title = item.get("title")
        if not title:
            continue

        published_at = None
        if item.get("publishedDate"):
            try:
                published_at = datetime.strptime(item["publishedDate"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except ValueError:
                pass

        deadline = None
        if item.get("closingDate"):
            try:
                deadline = datetime.strptime(item["closingDate"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
            except ValueError:
                pass

        entity = (item.get("procuringEntity") or {}).get("name", "")
        excerpt_parts = [item.get("category", ""), entity, item.get("overview") or item.get("description", "")]

        posts.append({
            "title": title,
            # No confirmed per-tender detail URL from the API response, so
            # this links to the general listing page rather than guessing a
            # slug pattern that might 404 -- the query string (ignored by
            # the page) just keeps each tender's link unique, since the
            # pipeline dedupes new opportunities by link.
            "link": f"{base_url}/tenders/notices?tender={item.get('documentId') or item.get('id')}",
            "excerpt": " ".join(p for p in excerpt_parts if p)[:500],
            "published_at": published_at,
            "deadline": deadline,
        })

    return posts
