import logging

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from .core.config import settings
from .core.database import SessionLocal
from .scrapers.pipeline import run_all_and_notify

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler()


def _run_job():
    db = SessionLocal()
    try:
        run_all_and_notify(db)
    finally:
        db.close()


def start_scheduler():
    scheduler.add_job(
        _run_job,
        CronTrigger(hour=settings.SCRAPE_HOUR_UTC, minute=0),
        id="daily_scrape",
        replace_existing=True,
    )
    scheduler.start()
    logger.info(f"Scheduler started: daily scrape at {settings.SCRAPE_HOUR_UTC:02d}:00 UTC")
