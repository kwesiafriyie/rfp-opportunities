"""
The news sites this system watches for consulting opportunities.

Each site is scraped one of three ways:

- "wp_rest": the site runs WordPress, so we pull structured JSON from its
  built-in /wp-json/wp/v2/posts REST API. category_slug scopes the scrape to
  a known WordPress category (e.g. standard.gm publishes notices under
  "Advertisement": https://standard.gm/category/advertisement/). When
  category_slug is None, the scraper scans recent posts across the whole
  site instead and leans entirely on the keyword filter.

- "rss": the site isn't WordPress but publishes a standard RSS feed at
  feed_path covering the content we need. (Not currently used by any source
  below -- kept for future sites where this fits; thepoint.gm's RSS feed
  turned out to be scoped to "Headlines" only, not its notices category.)

- "thepoint_html": bespoke scraper for thepoint.gm specifically (see
  app/scrapers/thepoint_scraper.py). It's a custom-built site with no REST
  API, and its RSS feed doesn't cover the category we need, so this scrapes
  its "Advertisements" category listing page directly.

- "gambiatenders_html": bespoke scraper for gambiatenders.com (see
  app/scrapers/gambiatenders_scraper.py). Custom tender aggregator, no REST
  API. Listing cards give title-only (no excerpt), so keyword matching runs
  on the title alone -- an acceptable trade-off since the site is already
  scoped to tenders/procurement, unlike a general news site.

- "tendersgm_html": bespoke scraper for tenders.gm (see
  app/scrapers/tendersgm_scraper.py). Custom (Next.js) but server-rendered,
  so no browser automation needed. Filters out closed tenders itself.

- "gppa_api": bespoke scraper for gppa.gm (see app/scrapers/gppa_scraper.py).
  gppa.gm's tender page is a client-side-rendered Next.js app with no data
  in the static HTML; this calls the same public Strapi CMS API
  (cms.gppa.gm) its own frontend calls. Filters out awarded/closed/
  cancelled tenders itself.

Either way, every post that comes back still has to pass the consulting
keyword filter (app/core/keywords.py) before it's stored.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Source:
    name: str
    base_url: str
    scraper: str = "wp_rest"  # "wp_rest", "rss", "thepoint_html", "gambiatenders_html", "tendersgm_html", or "gppa_api"
    category_slug: Optional[str] = None  # wp_rest only
    feed_path: Optional[str] = None  # rss only
    per_page: int = 20  # wp_rest only -- lower for sites whose server chokes on larger pages
    max_pages: int = 10  # wp_rest only -- lower for sites that slow down/fail at deeper pagination
    enabled: bool = True


SOURCES = [
    Source(name="standard.gm", base_url="https://standard.gm", scraper="wp_rest", category_slug="advertisement"),

    Source(name="thepoint.gm", base_url="https://thepoint.gm", scraper="thepoint_html"),

    # Confirmed WordPress via /wp-json/wp/v2/posts, but its server is fragile:
    # per_page=20 500'd after ~50s (per_page=1 was instant), and even at
    # per_page=5 it timed out on page 8 -- looks like a slow/unindexed
    # under-resourced host that struggles with WordPress's default
    # OFFSET-based pagination at any depth. Kept both small. No confirmed
    # notices category, so this scans recent site-wide posts and relies
    # entirely on the keyword filter.
    Source(
        name="foroyaa.net", base_url="https://foroyaa.net", scraper="wp_rest",
        category_slug=None, per_page=5, max_pages=6,
    ),

    # Confirmed WordPress via /wp-json/wp/v2/posts. "business" is the
    # category slug used at /category/business/.
    Source(
        name="dailyobservergambia.com", base_url="https://dailyobservergambia.com",
        scraper="wp_rest", category_slug="business",
    ),

    Source(name="gambiatenders.com", base_url="https://www.gambiatenders.com", scraper="gambiatenders_html"),

    Source(name="tenders.gm", base_url="https://tenders.gm", scraper="tendersgm_html"),

    Source(name="gppa.gm", base_url="https://gppa.gm", scraper="gppa_api"),
]
