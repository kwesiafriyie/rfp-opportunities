# Consulting Opportunities Backend

FastAPI backend that scrapes standard.gm, thepoint.gm, and foroyaa.net for
consulting/EOI/RFP notices via each site's WordPress REST API, stores matches
in SQLite, and serves them to the frontend.

## Project Structure

```
backend/
├── app/
│   ├── api/endpoints/opportunities.py  # GET list/detail, POST refresh
│   ├── core/
│   │   ├── config.py      # settings (DB URL, CORS, scrape schedule)
│   │   ├── sources.py     # the 3 sites being scraped
│   │   ├── keywords.py    # consulting-opportunity keyword filter
│   │   └── database.py
│   ├── models/opportunity.py
│   ├── scrapers/
│   │   ├── wp_rest_scraper.py  # generic WordPress REST API scraper
│   │   └── pipeline.py         # runs all sources, dedupes, stores
│   ├── scheduler.py        # daily scrape via APScheduler
│   └── main.py
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

3. (Optional) Create a `.env` file in the backend directory to override defaults:
   ```
   DATABASE_URL=sqlite:///./opportunities.db
   SCRAPE_HOUR_UTC=6
   ```

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

On startup the server runs an initial scrape in the background (so the DB
isn't empty), then re-scrapes daily at `SCRAPE_HOUR_UTC`. You can also trigger
a scrape manually: `POST /api/opportunities/refresh`.

## API Documentation

Once running:
- API docs: http://localhost:8000/docs
- `GET /api/opportunities/` — list opportunities (`?source=`, `?search=`, `?skip=`, `?limit=`)
- `GET /api/opportunities/{id}` — single opportunity
- `POST /api/opportunities/refresh` — trigger an immediate scrape

## Adding/tuning a source

Edit `app/core/sources.py`. Each `Source` needs a `base_url`; if you know the
site's WordPress category slug for its notices/classifieds section (check its
nav or an example post's `article:section` meta tag), set `category_slug` for
a tighter, faster scrape. Leaving it `None` scans recent posts site-wide and
relies entirely on the keyword filter in `app/core/keywords.py`.

## Deployment

- Backend: Uvicorn/Gunicorn behind a reverse proxy, or any host that runs a
  long-lived Python process (the scheduler needs the process to stay up)
- DB: SQLite is fine at this scale; swap `DATABASE_URL` for PostgreSQL if needed
