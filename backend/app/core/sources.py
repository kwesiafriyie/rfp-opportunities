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

Either way, every post that comes back still has to pass the consulting
keyword filter (app/core/keywords.py) before it's stored.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Source:
    name: str
    base_url: str
    scraper: str = "wp_rest"  # "wp_rest", "rss", or "thepoint_html"
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
]
