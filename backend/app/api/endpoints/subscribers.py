from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...models.subscriber import Subscriber

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


@router.delete("/{subscriber_id}", status_code=204)
async def remove_subscriber(subscriber_id: int, db: Session = Depends(get_db)):
    subscriber = db.query(Subscriber).filter(Subscriber.id == subscriber_id).first()
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    db.delete(subscriber)
    db.commit()
    return Response(status_code=204)
