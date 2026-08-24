from typing import List

from pydantic import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Consulting Opportunities"
    DATABASE_URL: str = "sqlite:///./opportunities.db"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    # Scraping
    SCRAPE_ON_STARTUP: bool = True
    SCRAPE_HOUR_UTC: int = 6  # daily scheduled scrape time

    # Email digest -- leave SMTP_USER/SMTP_PASSWORD unset to disable sending.
    # Credentials must come from environment variables / .env, never hardcoded.
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = ""

    @property
    def EMAIL_ENABLED(self) -> bool:
        return bool(self.SMTP_USER and self.SMTP_PASSWORD)

    class Config:
        env_file = ".env"
        case_sensitive = True
        env_file_encoding = "utf-8"


settings = Settings()
