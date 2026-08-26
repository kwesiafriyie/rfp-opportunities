import logging
from datetime import datetime, timezone
from typing import Dict, List, Tuple

from sqlalchemy.orm import Session

from ..core.keywords import find_matched_keywords
from ..core.normalize import classify_opportunity_type, classify_sector
from ..core.sources import SOURCES, Source
from ..models.opportunity import Opportunity
from .gambiatenders_scraper import fetch_posts as fetch_gambiatenders_posts
from .gppa_scraper import fetch_posts as fetch_gppa_posts
from .ppa_scraper import fetch_posts as fetch_ppa_posts
from .rss_scraper import fetch_rss_posts
from .tenderscomgh_scraper import fetch_posts as fetch_tenderscomgh_posts
from .tendersgm_scraper import fetch_posts as fetch_tendersgm_posts
from .thepoint_scraper import fetch_posts as fetch_thepoint_posts
from .ungm_scraper import fetch_posts as fetch_ungm_posts
from .wp_rest_scraper import fetch_posts

logger = logging.getLogger(__name__)


def _scrape_source(source: Source):
    if source.scraper == "rss":
        return fetch_rss_posts(source.base_url, source.feed_path)
    if source.scraper == "thepoint_html":
        return fetch_thepoint_posts(source.base_url)
    if source.scraper == "gambiatenders_html":
        return fetch_gambiatenders_posts(source.base_url)
    if source.scraper == "tendersgm_html":
        return fetch_tendersgm_posts(source.base_url)
    if source.scraper == "gppa_api":
        return fetch_gppa_posts(source.base_url)
    if source.scraper == "ppa_html":
        return fetch_ppa_posts(source.base_url)
    if source.scraper == "tenderscomgh_html":
        return fetch_tenderscomgh_posts(source.base_url)
    if source.scraper == "ungm_api":
        return fetch_ungm_posts(source.base_url)
    return fetch_posts(source.base_url, source.category_slug, per_page=source.per_page, max_pages=source.max_pages)


def _build_fields(post: Dict, keywords: List[str]) -> Dict:
    """Normalize a raw scraped post dict into the Opportunity model's
    mutable fields. Shared by both the insert and update paths so a
    re-scraped row is normalized identically to a freshly inserted one.
    """
    title = post.get("title")
    excerpt = post.get("excerpt")
    return {
        "title": title,
        "excerpt": excerpt,
        "published_at": post.get("published_at"),
        "deadline": post.get("deadline"),
        "deadline_raw": post.get("deadline_raw"),
        "matched_keywords": ",".join(keywords),
        "organization": post.get("organization"),
        "country": post.get("country"),
        "reference": post.get("reference"),
        "opportunity_type": classify_opportunity_type(post.get("opportunity_type"), title, excerpt),
        "sector": classify_sector(title, excerpt),
    }


def run_all(db: Session) -> Tuple[Dict[str, int], List[Opportunity]]:
    """Scrape every enabled source, keep only consulting-flavored, still-open
    posts, and store them -- inserting new ones and updating any that were
    already in the DB (a deadline extension, a corrected title, ...).

    Already-expired postings are discarded at scrape time rather than
    inserted; nothing already open is ever deleted just because a later
    scrape didn't see it again (a source dropping an item from its listing
    doesn't necessarily mean it's gone).

    Returns (new-record counts per source, the newly *inserted* Opportunity
    rows -- updates to existing rows aren't "new" for the email digest).
    """
    summary: Dict[str, int] = {}
    new_opportunities: List[Opportunity] = []
    now = datetime.now(timezone.utc)

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

            deadline = post.get("deadline")
            if deadline is not None and deadline <= now:
                continue  # already expired -- never store it in the first place

            keywords = find_matched_keywords(f"{title} {post.get('excerpt', '')}")
            if not keywords:
                continue

            fields = _build_fields(post, keywords)
            existing = db.query(Opportunity).filter(Opportunity.link == link).first()

            if existing:
                for field, value in fields.items():
                    setattr(existing, field, value)
                continue

            opportunity = Opportunity(source=source.name, link=link, **fields)
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
    new or SendGrid isn't configured -- see app/services/email_service.py.
    """
    summary, new_opportunities = run_all(db)

    if new_opportunities:
        from ..models.subscriber import Subscriber
        from ..services.email_service import send_digest

        recipients = [s.email for s in db.query(Subscriber).all()]
        send_digest(new_opportunities, recipients)

    return summary
