# RFP Opportunities Backend

FastAPI backend for the RFP Opportunities application.

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── endpoints/       # API route handlers
│   ├── core/               # Core functionality
│   ├── models/             # Database models
│   ├── scrapers/           # Web scrapers
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── main.py             # FastAPI application
├── tests/                  # Test files
├── .env                    # Environment variables
└── requirements.txt        # Python dependencies
```

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   DATABASE_URL=sqlite:///./tender_jobs.db
   ```

4. Run migrations (if using SQLAlchemy with migrations):
   ```bash
   alembic upgrade head
   ```

5. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation

Once the server is running, you can access:
- API documentation: http://localhost:8000/docs
- Alternative documentation: http://localhost:8000/redoc

## Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
```

### Linting
```bash
flake8
```

## Deployment

For production deployment, consider using:
- Gunicorn with Uvicorn workers
- Environment variables for configuration
- A production-grade database (PostgreSQL recommended)
