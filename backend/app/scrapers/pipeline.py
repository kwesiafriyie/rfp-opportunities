import logging
from typing import Dict

from sqlalchemy.orm import Session

from ..core.keywords import find_matched_keywords
from ..core.sources import SOURCES
from ..models.opportunity import Opportunity
from .wp_rest_scraper import fetch_posts

logger = logging.getLogger(__name__)


def run_all(db: Session) -> Dict[str, int]:
    """Scrape every enabled source, keep only consulting-flavored posts that
    aren't already in the DB, and store them. Returns new-record counts per
    source.
    """
    summary: Dict[str, int] = {}

    for source in SOURCES:
        if not source.enabled:
            continue

        logger.info(f"Scraping {source.name}...")
        try:
            posts = fetch_posts(source.base_url, source.category_slug)
        except Exception as e:
            logger.error(f"Scrape failed for {source.name}: {e}")
            summary[source.name] = 0
            continue

        added = 0
        for post in posts:
            link = post.get("link")
            title = post.get("title")
            if not link or not title:
                continue

            keywords = find_matched_keywords(f"{title} {post.get('excerpt', '')}")
            if not keywords:
                continue

            if db.query(Opportunity).filter(Opportunity.link == link).first():
                continue

            db.add(Opportunity(
                source=source.name,
                title=title,
                link=link,
                excerpt=post.get("excerpt"),
                published_at=post.get("published_at"),
                matched_keywords=",".join(keywords),
            ))
            added += 1

        db.commit()
        summary[source.name] = added
        logger.info(f"{source.name}: {added} new consulting opportunities")

    return summary
