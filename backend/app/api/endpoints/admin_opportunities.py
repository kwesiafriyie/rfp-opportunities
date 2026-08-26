import json
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, validator
from sqlalchemy import func as sa_func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...core.normalize import summarize
from ...models.opportunity import Opportunity
from ..deps import require_admin

router = APIRouter(dependencies=[Depends(require_admin)])


class DocumentItem(BaseModel):
    label: str
    url: str


class ExtraItem(BaseModel):
    label: str
    value: str


class OpportunityIntake(BaseModel):
    source: str
    title: str
    link: str  # the official opportunity URL -- doubles as the record's dedup key, same as scraped rows
    organization: Optional[str] = None
    country: Optional[str] = None
    opportunity_type: Optional[str] = None
    sector: Optional[str] = None
    description: Optional[str] = None
    published_at: Optional[datetime] = None
    deadline: Optional[datetime] = None
    reference: Optional[str] = None
    eligibility: Optional[str] = None
    contact_info: Optional[str] = None
    documents: List[DocumentItem] = []
    extra: List[ExtraItem] = []

    @validator("published_at", "deadline")
    def _assume_utc_if_naive(cls, value):
        # Every other timestamp in this app is UTC-aware; a naive value here
        # would otherwise silently mean different things to SQLite (stored
        # as-is) and Postgres (assumed to be in the session's timezone).
        if value is not None and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


def _normalize_manual_fields(payload: OpportunityIntake) -> dict:
    """Manual intake gets the same normalized field set as a scraped post
    (see pipeline._build_fields), but skips the rule-based opportunity_type/
    sector classifiers -- an admin explicitly choosing a type/sector from
    the taxonomy is authoritative and shouldn't be second-guessed by the
    same fuzzy heuristic used to guess at an unlabeled scraped source.
    """
    excerpt = summarize(payload.description) if payload.description else None
    documents = [d.dict() for d in payload.documents]
    extra = [e.dict() for e in payload.extra]
    return {
        "title": payload.title,
        "excerpt": excerpt,
        "description": payload.description,
        "published_at": payload.published_at,
        "deadline": payload.deadline,
        "organization": payload.organization,
        "country": payload.country,
        "reference": payload.reference,
        "opportunity_type": payload.opportunity_type,
        "sector": payload.sector,
        "eligibility": payload.eligibility,
        "contact_info": payload.contact_info,
        "documents": json.dumps(documents) if documents else None,
        "extra": json.dumps(extra) if extra else None,
    }


def _find_possible_duplicate(
    db: Session, payload: OpportunityIntake, exclude_id: Optional[int] = None
) -> Optional[Opportunity]:
    """Best-effort duplicate detection for manual intake, in priority order:
    exact official-URL match, then same source+reference, then a
    title+organization+deadline combination. Never blocks automatically --
    the caller surfaces this as a warning the admin can override.
    """
    query = db.query(Opportunity)
    if exclude_id is not None:
        query = query.filter(Opportunity.id != exclude_id)

    by_link = query.filter(Opportunity.link == payload.link).first()
    if by_link:
        return by_link

    if payload.reference:
        by_reference = query.filter(
            Opportunity.source == payload.source,
            Opportunity.reference.isnot(None),
            sa_func.lower(Opportunity.reference) == payload.reference.lower(),
        ).first()
        if by_reference:
            return by_reference

    if payload.deadline and payload.organization:
        by_combo = query.filter(
            sa_func.lower(Opportunity.title) == payload.title.lower(),
            Opportunity.organization.isnot(None),
            sa_func.lower(Opportunity.organization) == payload.organization.lower(),
            Opportunity.deadline == payload.deadline,
        ).first()
        if by_combo:
            return by_combo

    return None


@router.get("/opportunities")
async def list_all_opportunities(
    response: Response,
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    source: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Admin listing -- deliberately NOT restricted to open/unexpired
    opportunities like the public endpoint, since admins need to find and
    correct expired or incorrectly-parsed records too.
    """
    query = db.query(Opportunity)
    if source:
        query = query.filter(Opportunity.source == source)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Opportunity.title.ilike(pattern),
                Opportunity.organization.ilike(pattern),
                Opportunity.reference.ilike(pattern),
            )
        )

    response.headers["X-Total-Count"] = str(query.order_by(None).count())
    opportunities = (
        query.order_by(Opportunity.created_at.desc()).offset(skip).limit(limit).all()
    )
    return [o.to_dict() for o in opportunities]


@router.post("/opportunities", status_code=201)
async def create_opportunity(
    payload: OpportunityIntake, force: bool = False, db: Session = Depends(get_db)
):
    if not force:
        duplicate = _find_possible_duplicate(db, payload)
        if duplicate:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "A similar opportunity already exists. Edit the existing one instead, or resubmit to create a new one anyway.",
                    "existing_opportunity": duplicate.to_dict(),
                },
            )

    fields = _normalize_manual_fields(payload)
    opportunity = Opportunity(
        source=payload.source, link=payload.link, ingestion_method="manual", **fields
    )
    db.add(opportunity)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409, detail="An opportunity with this official URL already exists."
        )
    db.refresh(opportunity)
    return opportunity.to_dict()


@router.put("/opportunities/{opportunity_id}")
async def update_opportunity(
    opportunity_id: int,
    payload: OpportunityIntake,
    force: bool = False,
    db: Session = Depends(get_db),
):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    if not force:
        duplicate = _find_possible_duplicate(db, payload, exclude_id=opportunity_id)
        if duplicate:
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "Another opportunity already matches these details.",
                    "existing_opportunity": duplicate.to_dict(),
                },
            )

    fields = _normalize_manual_fields(payload)
    opportunity.source = payload.source
    opportunity.link = payload.link
    for field, value in fields.items():
        setattr(opportunity, field, value)
    # ingestion_method is set once at creation and never touched by edits --
    # correcting a scraped opportunity doesn't change how it originally entered the system.

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409, detail="Another opportunity with this official URL already exists."
        )
    db.refresh(opportunity)
    return opportunity.to_dict()


@router.delete("/opportunities/{opportunity_id}", status_code=204)
async def delete_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    db.delete(opportunity)
    db.commit()
    return Response(status_code=204)
