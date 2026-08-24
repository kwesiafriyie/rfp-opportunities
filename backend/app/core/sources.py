"""
The three Gambian news sites this system watches for consulting opportunities.

Each site runs WordPress, which exposes a REST API at /wp-json/wp/v2/posts.
That's what we scrape from -- no HTML selectors to maintain, no Selenium.

category_slug scopes the scrape to a known WordPress category (e.g. standard.gm
publishes notices under "Advertisement": https://standard.gm/category/advertisement/).
When category_slug is None, the scraper scans recent posts across the whole site
instead and leans entirely on the keyword filter -- use this until the site's
actual notices/classifieds category is confirmed.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class Source:
    name: str
    base_url: str
    category_slug: Optional[str] = None
    enabled: bool = True


SOURCES = [
    Source(name="standard.gm", base_url="https://standard.gm", category_slug="advertisement"),
    # TODO: confirm the notices/classifieds category slug for these two and set it
    # below (e.g. category_slug="advertisement") for tighter, faster scraping.
    # Until then they scan recent site-wide posts and rely on the keyword filter.
    Source(name="thepoint.gm", base_url="https://thepoint.gm", category_slug=None),
    Source(name="foroyaa.net", base_url="https://foroyaa.net", category_slug=None),
]
