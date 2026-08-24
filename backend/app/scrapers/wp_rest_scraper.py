"""Scrapes a WordPress site's built-in REST API (/wp-json/wp/v2/posts) for
recent posts. Works on any standard WordPress install with the REST API
enabled -- no HTML selectors, no browser automation.
"""
import logging
import re
from datetime import datetime, timedelta, timezone
from html import unescape
from typing import Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15
PER_PAGE = 20
MAX_PAGES = 10
# Notices/EOI categories on these sites post infrequently (standard.gm's
# "Advertisement" category, for example, went over a year between posts) --
# too short a window silently filters out everything before the keyword
# filter ever runs. MAX_PAGES already caps total requests, so a generous
# window here is cheap.
LOOKBACK_DAYS = 730


def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    return unescape(re.sub(r"\s+", " ", text)).strip()


def _get_category_id(base_url: str, slug: str) -> Optional[int]:
    try:
        resp = requests.get(
            f"{base_url}/wp-json/wp/v2/categories",
            params={"slug": slug},
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )
        resp.raise_for_status()
        data = resp.json()
        return data[0]["id"] if data else None
    except (requests.RequestException, ValueError) as e:
        logger.warning(f"Could not resolve category '{slug}' on {base_url}: {e}")
        return None


def fetch_posts(base_url: str, category_slug: Optional[str] = None) -> List[Dict]:
    """Fetch recent posts from a WordPress site, newest first.

    If category_slug is given, scope to that category. Otherwise scan recent
    posts site-wide. Stops once posts older than LOOKBACK_DAYS are reached,
    or MAX_PAGES is hit, whichever comes first.
    """
    params = {"orderby": "date", "order": "desc"}

    if category_slug:
        category_id = _get_category_id(base_url, category_slug)
        if category_id is None:
            logger.warning(f"Category '{category_slug}' not found on {base_url}; skipping")
            return []
        params["categories"] = category_id

    cutoff = datetime.now(timezone.utc) - timedelta(days=LOOKBACK_DAYS)
    posts: List[Dict] = []

    for page in range(1, MAX_PAGES + 1):
        try:
            resp = requests.get(
                f"{base_url}/wp-json/wp/v2/posts",
                params={**params, "per_page": PER_PAGE, "page": page},
                headers={"User-Agent": USER_AGENT},
                timeout=REQUEST_TIMEOUT,
            )
            if resp.status_code == 400:
                # WordPress returns 400 once you page past the last page.
                break
            resp.raise_for_status()
        except requests.RequestException as e:
            logger.warning(f"Failed to fetch page {page} from {base_url}: {e}")
            break

        try:
            batch = resp.json()
        except ValueError:
            logger.warning(f"Non-JSON response from {base_url} (REST API likely disabled)")
            break

        if not batch:
            break

        reached_cutoff = False
        for item in batch:
            published_dt = None
            date_gmt = item.get("date_gmt")
            if date_gmt:
                published_dt = datetime.fromisoformat(date_gmt).replace(tzinfo=timezone.utc)
                if published_dt < cutoff:
                    reached_cutoff = True
                    break

            posts.append({
                "title": _strip_html(item.get("title", {}).get("rendered", "")),
                "link": item.get("link"),
                "excerpt": _strip_html(item.get("excerpt", {}).get("rendered", ""))[:500],
                "published_at": published_dt,
            })

        if reached_cutoff or len(batch) < PER_PAGE:
            break

    return posts
