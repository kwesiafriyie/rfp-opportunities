import logging
from typing import Dict, List, Tuple

from sqlalchemy.orm import Session

from ..core.keywords import find_matched_keywords
from ..core.sources import SOURCES, Source
from ..models.opportunity import Opportunity
from .rss_scraper import fetch_rss_posts
from .wp_rest_scraper import fetch_posts

logger = logging.getLogger(__name__)


def _scrape_source(source: Source):
    if source.scraper == "rss":
        return fetch_rss_posts(source.base_url, source.feed_path)
    return fetch_posts(source.base_url, source.category_slug)


def run_all(db: Session) -> Tuple[Dict[str, int], List[Opportunity]]:
    """Scrape every enabled source, keep only consulting-flavored posts that
    aren't already in the DB, and store them.

    Returns (new-record counts per source, the newly stored Opportunity rows).
    """
    summary: Dict[str, int] = {}
    new_opportunities: List[Opportunity] = []

    for source in SOURCES:
        if not source.enabled:
            continue

        logger.info(f"Scraping {source.name}...")
        try:
            posts = _scrape_source(source)
        except Exception as e:
            logger.error(f"Scrape failed for {source.name}: {e}")
            summary[source.name] = 0
            continue

        logger.info(f"{source.name}: fetched {len(posts)} recent post(s) before filtering")

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

            opportunity = Opportunity(
                source=source.name,
                title=title,
                link=link,
                excerpt=post.get("excerpt"),
                published_at=post.get("published_at"),
                matched_keywords=",".join(keywords),
            )
            db.add(opportunity)
            added += 1
            new_opportunities.append(opportunity)

        db.commit()
        summary[source.name] = added
        logger.info(f"{source.name}: {added} new consulting opportunities")

    return summary, new_opportunities


def run_all_and_notify(db: Session) -> Dict[str, int]:
    """Scrape all sources, store new opportunities, and email subscribers a
    digest of whatever's new. Email sending is a no-op if there's nothing
    new or SMTP isn't configured -- see app/services/email_service.py.
    """
    summary, new_opportunities = run_all(db)

    if new_opportunities:
        from ..models.subscriber import Subscriber
        from ..services.email_service import send_digest

        recipients = [s.email for s in db.query(Subscriber).all()]
        send_digest(new_opportunities, recipients)

    return summary
