from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ...core.security import admin_enabled, create_admin_token, verify_admin_password

router = APIRouter()


class LoginRequest(BaseModel):
    password: str


@router.post("/login")
async def login(payload: LoginRequest):
    if not admin_enabled():
        raise HTTPException(status_code=503, detail="Admin access is not configured")
    if not verify_admin_password(payload.password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    return {"token": create_admin_token()}
