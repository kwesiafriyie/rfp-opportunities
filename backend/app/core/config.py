from typing import List

from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Consulting Opportunities"
    DATABASE_URL: str = "sqlite:///./opportunities.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    # Optional regex for additional allowed origins -- e.g. Vercel preview
    # deployments get a fresh URL per push, so BACKEND_CORS_ORIGINS alone
    # (an exact-match list) would need updating on every deploy. Leave blank
    # to disable.
    BACKEND_CORS_ORIGIN_REGEX: str = ""

    # Scraping
    SCRAPE_ON_STARTUP: bool = True
    SCRAPE_HOUR_UTC: int = 6  # daily scheduled scrape time

    # Email digest, sent via the SendGrid HTTP API (https://sendgrid.com) --
    # plain SMTP doesn't work here since Render blocks outbound SMTP ports
    # (25/465/587) on every plan. FROM_EMAIL must be a "Single Sender"
    # verified in SendGrid (verified by clicking a link they email you --
    # no domain/DNS needed), otherwise SendGrid rejects the send. Leave
    # SENDGRID_API_KEY unset to disable sending. Credentials must come from
    # environment variables / .env, never hardcoded.
    SENDGRID_API_KEY: str = ""
    FROM_EMAIL: str = ""
    # Physical mailing address shown in every digest's footer -- required by
    # anti-spam law (CAN-SPAM/CASL) for this kind of bulk/opt-in email, and
    # its presence also tends to help deliverability (its absence reads as
    # spammy to filters). Leave blank to omit -- but note that likely hurts
    # deliverability more than it helps.
    MAILING_ADDRESS: str = ""
    # This backend's own public URL (e.g. the Render service URL), used to
    # build a one-click unsubscribe link in each digest's footer. Leave
    # blank to omit the link (falls back to a plain-text explanation).
    BACKEND_PUBLIC_URL: str = ""

    @property
    def EMAIL_ENABLED(self) -> bool:
        return bool(self.SENDGRID_API_KEY and self.FROM_EMAIL)

    class Config:
        env_file = ".env"
        case_sensitive = True
        env_file_encoding = "utf-8"


settings = Settings()
