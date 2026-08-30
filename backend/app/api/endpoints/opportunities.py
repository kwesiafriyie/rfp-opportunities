from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Response
from sqlalchemy import func as sa_func, or_
from sqlalchemy.orm import Session

from ...core.database import SessionLocal, get_db
from ...models.opportunity import Opportunity
from ...schemas.opportunity import OpportunityOut
from ...scrapers.pipeline import run_all_and_notify

router = APIRouter()

_SORT_OPTIONS = {
    "deadline_asc": lambda: Opportunity.deadline.asc().nullslast(),
    "deadline_desc": lambda: Opportunity.deadline.desc().nullslast(),
    "newest": lambda: Opportunity.published_at.desc().nullslast(),
}


def _open_only(query, now: datetime):
    """The one non-negotiable baseline: an opportunity is only "open" if it
    has no known deadline, or that deadline hasn't passed yet. Applied to
    every listing/detail/facet query so an expired opportunity can never
    surface anywhere in the active experience regardless of what other
    filters are (or aren't) requested, and regardless of whether the
    frontend has refreshed recently.
    """
    return query.filter(or_(Opportunity.deadline.is_(None), Opportunity.deadline > now))


def _parse_date_param(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)


@router.get("/", response_model=List[OpportunityOut])
async def list_opportunities(
    response: Response,
    skip: int = 0,
    limit: int = 50,
    source: Optional[str] = None,
    search: Optional[str] = None,
    country: Optional[str] = None,
    opportunity_type: Optional[str] = None,
    sector: Optional[str] = None,
    deadline_within_days: Optional[int] = None,
    published_within_days: Optional[int] = None,
    deadline_from: Optional[str] = None,
    deadline_to: Optional[str] = None,
    published_from: Optional[str] = None,
    published_to: Optional[str] = None,
    sort: str = "deadline_asc",
    db: Session = Depends(get_db),
):
    """List currently-open opportunities, filtered and sorted server-side.

    Expired opportunities (deadline in the past) are always excluded --
    this is enforced here, not left to the frontend, so it holds regardless
    of which client calls this endpoint or how stale its own state is.
    """
    now = datetime.now(timezone.utc)
    query = _open_only(db.query(Opportunity), now)

    if source:
        query = query.filter(Opportunity.source == source)
    if country:
        query = query.filter(sa_func.lower(Opportunity.country) == country.lower())
    if opportunity_type:
        query = query.filter(Opportunity.opportunity_type == opportunity_type)
    if sector:
        query = query.filter(Opportunity.sector == sector)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Opportunity.title.ilike(pattern),
                Opportunity.excerpt.ilike(pattern),
                Opportunity.organization.ilike(pattern),
                Opportunity.country.ilike(pattern),
                Opportunity.reference.ilike(pattern),
            )
        )

    if deadline_within_days is not None:
        query = query.filter(
            Opportunity.deadline.isnot(None),
            Opportunity.deadline <= now + timedelta(days=deadline_within_days),
        )
    deadline_from_dt = _parse_date_param(deadline_from)
    if deadline_from_dt:
        query = query.filter(Opportunity.deadline >= deadline_from_dt)
    deadline_to_dt = _parse_date_param(deadline_to)
    if deadline_to_dt:
        query = query.filter(Opportunity.deadline <= deadline_to_dt)

    if published_within_days is not None:
        query = query.filter(
            Opportunity.published_at.isnot(None),
            Opportunity.published_at >= now - timedelta(days=published_within_days),
        )
    published_from_dt = _parse_date_param(published_from)
    if published_from_dt:
        query = query.filter(Opportunity.published_at >= published_from_dt)
    published_to_dt = _parse_date_param(published_to)
    if published_to_dt:
        query = query.filter(Opportunity.published_at <= published_to_dt)

    response.headers["X-Total-Count"] = str(query.order_by(None).count())

    order_by = _SORT_OPTIONS.get(sort, _SORT_OPTIONS["deadline_asc"])()
    opportunities = query.order_by(order_by).offset(skip).limit(limit).all()
    return [o.to_dict() for o in opportunities]


@router.get("/filters")
async def get_filters(db: Session = Depends(get_db)):
    """Distinct filter values (and counts) across the currently-open
    dataset only -- so the filter UI never offers a country/type/sector
    that has nothing but expired opportunities behind it.
    """
    now = datetime.now(timezone.utc)

    def counts(column):
        rows = (
            _open_only(db.query(column, sa_func.count(Opportunity.id)), now)
            .filter(column.isnot(None), column != "")
            .group_by(column)
            .order_by(sa_func.count(Opportunity.id).desc())
            .all()
        )
        return [{"value": value, "count": count} for value, count in rows]

    return {
        "sources": counts(Opportunity.source),
        "countries": counts(Opportunity.country),
        "opportunity_types": counts(Opportunity.opportunity_type),
        "sectors": counts(Opportunity.sector),
    }


@router.get("/{opportunity_id}", response_model=OpportunityOut)
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
