from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy.orm import Session

from ...core.database import SessionLocal, get_db
from ...models.opportunity import Opportunity
from ...scrapers.pipeline import run_all_and_notify

router = APIRouter()


@router.get("/", response_model=List[dict])
async def list_opportunities(
    skip: int = 0,
    limit: int = 50,
    source: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """List opportunities, newest first. Optionally filter by source or a
    title search term.
    """
    query = db.query(Opportunity)
    if source:
        query = query.filter(Opportunity.source == source)
    if search:
        query = query.filter(Opportunity.title.ilike(f"%{search}%"))

    opportunities = (
        query.order_by(Opportunity.published_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [o.to_dict() for o in opportunities]


@router.get("/{opportunity_id}", response_model=dict)
async def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity.to_dict()


def _refresh_task():
    db = SessionLocal()
    try:
        run_all_and_notify(db)
    finally:
        db.close()


@router.post("/refresh")
async def refresh_opportunities(background_tasks: BackgroundTasks):
    """Trigger an immediate scrape of all sources instead of waiting for the
    next scheduled run. Runs in the background; check /api/opportunities
    shortly after to see results.
    """
    background_tasks.add_task(_refresh_task)
    return {"status": "refresh started"}
