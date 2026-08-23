from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from pathlib import Path
import os

from .core.config import settings
from .core.database import Base, engine
from .api.endpoints import opportunities

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for RFP Opportunities",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(
    opportunities.router,
    prefix="/api/opportunities",
    tags=["opportunities"]
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# For development
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
