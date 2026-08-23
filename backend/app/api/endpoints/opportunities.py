from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from ...models.opportunity import Opportunity
from ...core.database import get_db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_opportunities(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve all opportunities with pagination
    """
    opportunities = db.query(Opportunity).offset(skip).limit(limit).all()
    return [opp.to_dict() for opp in opportunities]

@router.get("/recent", response_model=List[dict])
async def get_recent_opportunities(
    days: int = 7,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get recent opportunities from the last N days
    """
    date_threshold = datetime.utcnow() - timedelta(days=days)
    opportunities = db.query(Opportunity).filter(
        Opportunity.created_at >= date_threshold
    ).order_by(
        Opportunity.created_at.desc()
    ).limit(limit).all()
    
    return [opp.to_dict() for opp in opportunities]

@router.get("/{opportunity_id}", response_model=dict)
async def get_opportunity(
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific opportunity by ID
    """
    opportunity = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return opportunity.to_dict()
