"""
The three Gambian news sites this system watches for consulting opportunities.

Each site is scraped one of two ways:

- "wp_rest": the site runs WordPress, so we pull structured JSON from its
  built-in /wp-json/wp/v2/posts REST API. category_slug scopes the scrape to
  a known WordPress category (e.g. standard.gm publishes notices under
  "Advertisement": https://standard.gm/category/advertisement/). When
  category_slug is None, the scraper scans recent posts across the whole
  site instead and leans entirely on the keyword filter.

- "rss": the site isn't WordPress but publishes a standard RSS feed at
  feed_path. Used for thepoint.gm, which is a custom-built site with no
  REST API but does declare an RSS feed in its <head>.

Either way, every post that comes back still has to pass the consulting
keyword filter (app/core/keywords.py) before it's stored.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Source:
    name: str
    base_url: str
    scraper: str = "wp_rest"  # "wp_rest" or "rss"
    category_slug: Optional[str] = None  # wp_rest only
    feed_path: Optional[str] = None  # rss only
    enabled: bool = True


SOURCES = [
    Source(name="standard.gm", base_url="https://standard.gm", scraper="wp_rest", category_slug="advertisement"),

    # Not WordPress -- custom-built site. It declares an RSS feed
    # (/posts/rss/xml) titled "Headlines" in its <head>; unconfirmed whether
    # that feed actually includes the "Advertisements" category (URL slug
    # /technology) where notices/tenders live, or just top headlines. If it
    # turns out too narrow, switch to an HTML scraper against
    # https://thepoint.gm/technology instead.
    Source(name="thepoint.gm", base_url="https://thepoint.gm", scraper="rss", feed_path="/posts/rss/xml"),

    # TODO: confirm whether foroyaa.net is WordPress (check
    # foroyaa.net/wp-json/wp/v2/posts?per_page=1) or has an RSS feed. Until
    # confirmed, this scans recent site-wide WP REST posts (best-effort
    # guess) and relies entirely on the keyword filter, per instruction to
    # just search by keyword here rather than scope to a category.
    Source(name="foroyaa.net", base_url="https://foroyaa.net", scraper="wp_rest", category_slug=None),
]
