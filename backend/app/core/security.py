"""Admin auth: a single shared passphrase, not per-user accounts -- this is
a single-operator tool. Login exchanges the passphrase for a signed,
time-limited bearer token (no server-side session store needed); the
frontend sends it back as `Authorization: Bearer <token>` on every admin
request, verified by the require_admin dependency below.

A bearer token in an Authorization header, rather than a cookie, sidesteps
cross-site cookie complications entirely -- the frontend (Vercel) and
backend (Render) are on different origins, and a cross-origin cookie needs
SameSite=None + Secure + a concrete (non-wildcard) CORS origin list to work
at all. A header needs none of that.
"""
import logging
import secrets

from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from .config import settings

logger = logging.getLogger(__name__)

SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7  # 7 days

_secret_key = settings.SECRET_KEY
if not _secret_key:
    logger.warning(
        "SECRET_KEY is not set -- generating a random one for this process. "
        "Admin sessions will not survive a restart/redeploy until SECRET_KEY is set."
    )
    _secret_key = secrets.token_hex(32)

_serializer = URLSafeTimedSerializer(_secret_key, salt="admin-session")


def admin_enabled() -> bool:
    return bool(settings.ADMIN_PASSWORD)


def verify_admin_password(password: str) -> bool:
    if not admin_enabled():
        return False
    return secrets.compare_digest(password, settings.ADMIN_PASSWORD)


def create_admin_token() -> str:
    return _serializer.dumps({"role": "admin"})


def verify_admin_token(token: str) -> bool:
    try:
        data = _serializer.loads(token, max_age=SESSION_MAX_AGE_SECONDS)
    except (BadSignature, SignatureExpired):
        return False
    return data.get("role") == "admin"
