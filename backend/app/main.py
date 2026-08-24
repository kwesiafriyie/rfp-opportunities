import logging
import threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.endpoints import opportunities, subscribers
from .core.config import settings
from .core.database import Base, SessionLocal, engine
from .scheduler import start_scheduler
from .scrapers.pipeline import run_all_and_notify

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for consulting opportunities scraped from trusted news sources",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    opportunities.router,
    prefix="/api/opportunities",
    tags=["opportunities"],
)
app.include_router(
    subscribers.router,
    prefix="/api/subscribers",
    tags=["subscribers"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


def _initial_scrape():
    db = SessionLocal()
    try:
        run_all_and_notify(db)
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    start_scheduler()
    if settings.SCRAPE_ON_STARTUP:
        # Run once in the background on boot so the DB isn't empty while
        # waiting for the next scheduled run; doesn't block server startup.
        threading.Thread(target=_initial_scrape, daemon=True).start()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
