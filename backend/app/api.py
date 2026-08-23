# api.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import logging

# Setup logging for backend
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Explicitly allow your frontend origin
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS"],  # Explicitly allow GET and OPTIONS
    allow_headers=["*"],  # Allow all headers
)

def get_db():
    conn = sqlite3.connect("tender_jobs.db")
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

@app.get("/jobs")
def get_jobs():
    logger.info("Received GET request for /jobs")
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM jobs")
    jobs = [dict(row) for row in cursor.fetchall()]
    conn.close()
    logger.info(f"Returning {len(jobs)} jobs")
    return jobs

# Explicitly handle OPTIONS for preflight
@app.options("/jobs")
def options_jobs():
    logger.info("Received OPTIONS request for /jobs")
    return {"message": "Preflight OK"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)