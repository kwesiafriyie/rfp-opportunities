import os
from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "RFP Opportunities"
    DATABASE_URL: str = "sqlite:///./tender_jobs.db"
    
    # Authentication
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        env_file_encoding = 'utf-8'

# Create instance
settings = Settings()
