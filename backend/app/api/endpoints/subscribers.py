from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from ...core.config import settings
from ...core.database import get_db
from ...models.opportunity import Opportunity
from ...models.subscriber import Subscriber
from ...services.email_service import send_digest

router = APIRouter()


class SubscriberCreate(BaseModel):
    email: EmailStr


@router.get("/", response_model=list)
async def list_subscribers(db: Session = Depends(get_db)):
    subscribers = db.query(Subscriber).order_by(Subscriber.created_at.desc()).all()
    return [s.to_dict() for s in subscribers]


@router.post("/", response_model=dict, status_code=201)
async def add_subscriber(payload: SubscriberCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(Subscriber).filter(Subscriber.email == email).first():
        raise HTTPException(status_code=409, detail="This email is already subscribed")

    subscriber = Subscriber(email=email)
    db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return subscriber.to_dict()


@router.post("/test-email", response_model=dict)
async def send_test_email(db: Session = Depends(get_db)):
    """Sends a one-off sample digest to every current subscriber, using the
    exact same send_digest() path the real scraper uses -- lets you verify
    email delivery works without waiting for a genuinely new opportunity to
    be scraped.
    """
    if not settings.EMAIL_ENABLED:
        raise HTTPException(status_code=400, detail="Email isn't configured (SENDGRID_API_KEY/FROM_EMAIL unset)")

    recipients = [s.email for s in db.query(Subscriber).all()]
    if not recipients:
        raise HTTPException(status_code=400, detail="No subscribers to send to")

    sample = Opportunity(
        source="standard.gm",
        title="Sample: Request for Expression of Interest -- Individual Consultant",
        link="https://example.com/sample-opportunity",
        excerpt="This is a test email to confirm delivery is working.",
        published_at=datetime.now(timezone.utc),
        matched_keywords="test",
    )
    send_digest([sample], recipients)
    return {"status": "test email sent", "recipients": len(recipients)}


@router.delete("/{subscriber_id}", status_code=204)
async def remove_subscriber(subscriber_id: int, db: Session = Depends(get_db)):
    subscriber = db.query(Subscriber).filter(Subscriber.id == subscriber_id).first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    db.delete(subscriber)
    db.commit()
    return Response(status_code=204)
