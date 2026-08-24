"""Scrapes a site's RSS feed for recent posts. Used for sites that aren't
WordPress (so no /wp-json REST API) but still publish a standard RSS feed --
common even on custom-built news sites.
"""
import logging
import re
from datetime import timezone
from email.utils import parsedate_to_datetime
from html import unescape
from typing import Dict, List
from xml.etree import ElementTree

import requests

logger = logging.getLogger(__name__)

USER_AGENT = "Mozilla/5.0 (compatible; ConsultingOpportunitiesBot/1.0; +https://github.com/)"
REQUEST_TIMEOUT = 15


def _strip_html(html: str) -> str:
    text = re.sub(r"<[^>]+>", " ", html or "")
    return unescape(re.sub(r"\s+", " ", text)).strip()


def _parse_pub_date(raw: str):
    try:
        dt = parsedate_to_datetime(raw)
    except (TypeError, ValueError):
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def fetch_rss_posts(base_url: str, feed_path: str) -> List[Dict]:
    """Fetch and parse an RSS 2.0 feed, returning normalized post dicts."""
    url = f"{base_url}{feed_path}"
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.warning(f"Failed to fetch RSS feed {url}: {e}")
        return []

    try:
        root = ElementTree.fromstring(resp.content)
    except ElementTree.ParseError as e:
        logger.warning(f"Failed to parse RSS feed {url}: {e}")
        return []

    posts: List[Dict] = []
    for item in root.iter("item"):
        title = _strip_html(item.findtext("title") or "")
        link = (item.findtext("link") or "").strip()
        if not title or not link:
            continue

        description = _strip_html(item.findtext("description") or "")[:500]
        pub_date_raw = item.findtext("pubDate")
        published_at = _parse_pub_date(pub_date_raw) if pub_date_raw else None

        posts.append({
            "title": title,
            "link": link,
            "excerpt": description,
            "published_at": published_at,
        })

    return posts
