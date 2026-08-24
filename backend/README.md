# Consulting Opportunities Backend

FastAPI backend that scrapes standard.gm, thepoint.gm, foroyaa.net,
dailyobservergambia.com, gambiatenders.com, tenders.gm, and gppa.gm for
consulting/EOI/RFP notices, stores matches in SQLite (or Postgres in
production), and serves them to the frontend. standard.gm, foroyaa.net, and
dailyobservergambia.com are scraped via WordPress's built-in REST API;
thepoint.gm, gambiatenders.com, and tenders.gm are each custom-built sites
with a bespoke HTML scraper; gppa.gm is a client-side-rendered app scraped
via its own public CMS API instead.

## Project Structure

```
backend/
├── app/
│   ├── api/endpoints/
│   │   ├── opportunities.py  # GET list/detail, POST refresh
│   │   └── subscribers.py    # GET/POST/DELETE email recipients
│   ├── core/
│   │   ├── config.py      # settings (DB URL, CORS, scrape schedule, email)
│   │   ├── sources.py     # the 3 sites being scraped
│   │   ├── keywords.py    # consulting-opportunity keyword filter
│   │   └── database.py
│   ├── models/
│   │   ├── opportunity.py
│   │   └── subscriber.py
│   ├── scrapers/
│   │   ├── wp_rest_scraper.py         # generic WordPress REST API scraper
│   │   ├── rss_scraper.py             # generic RSS feed scraper (unused currently)
│   │   ├── thepoint_scraper.py        # bespoke HTML scraper for thepoint.gm
│   │   ├── gambiatenders_scraper.py   # bespoke HTML scraper for gambiatenders.com
│   │   ├── tendersgm_scraper.py       # bespoke HTML scraper for tenders.gm
│   │   ├── gppa_scraper.py            # bespoke API scraper for gppa.gm
│   │   └── pipeline.py                # runs all sources, dedupes, stores, emails
│   ├── services/email_service.py  # HTML digest email via Resend's HTTP API
│   ├── scheduler.py        # daily scrape via APScheduler
│   └── main.py
├── .env.example
└── requirements.txt
```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and fill in whatever you want to override.
   Everything has a sane default except email: leave `RESEND_API_KEY` blank
   to disable sending, or fill it in to enable the digest emails (see
   `.env.example` for Resend setup -- it's an HTTP API, not SMTP, since most
   PaaS hosts block outbound SMTP).

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

On startup the server runs an initial scrape in the background (so the DB
isn't empty), then re-scrapes daily at `SCRAPE_HOUR_UTC`. You can also trigger
a scrape manually: `POST /api/opportunities/refresh`. Every scrape run that
finds new opportunities emails a digest to everyone in the subscribers list,
if email is configured.

## API Documentation

Once running:
- API docs: http://localhost:8000/docs
- `GET /api/opportunities/` — list opportunities (`?source=`, `?search=`, `?skip=`, `?limit=`)
- `GET /api/opportunities/{id}` — single opportunity
- `POST /api/opportunities/refresh` — trigger an immediate scrape
- `GET /api/subscribers/` — list email recipients
- `POST /api/subscribers/` — add a recipient (`{"email": "..."}`)
- `DELETE /api/subscribers/{id}` — remove a recipient

## Adding/tuning a source

Edit `app/core/sources.py`. Each `Source` needs a `base_url` and a `scraper`
type:

- `"wp_rest"` (WordPress sites): if you know the site's WordPress category
  slug for its notices/classifieds section (check its nav, or an example
  post's `article:section` meta tag / breadcrumb), set `category_slug` for a
  tighter, faster scrape. Leaving it `None` scans recent posts site-wide and
  relies entirely on the keyword filter in `app/core/keywords.py`.
- `"rss"` (non-WordPress sites): set `feed_path` to the site's RSS feed path
  (look for `<link rel="alternate" type="application/rss+xml">` in an example
  page's `<head>`). No category scoping -- relies entirely on the keyword
  filter.

Either way, confirm the site isn't WordPress before reaching for RSS: check
`<base_url>/wp-json/wp/v2/posts?per_page=1` in a browser first.

## Deployment

- Backend: Uvicorn/Gunicorn behind a reverse proxy, or any host that runs a
  long-lived Python process (the scheduler needs the process to stay up)
- DB: SQLite is fine at this scale; swap `DATABASE_URL` for PostgreSQL if needed
