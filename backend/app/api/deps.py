from fastapi import Header, HTTPException

from ..core.security import verify_admin_token


async def require_admin(authorization: str = Header(None)) -> None:
    """FastAPI dependency guarding every admin-only route. The frontend's
    only real security boundary is this check -- hiding a nav link or
    redirecting client-side is UX convenience, not enforcement.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization[len("Bearer "):]
    if not verify_admin_token(token):
        raise HTTPException(status_code=401, detail="Invalid or expired session")
