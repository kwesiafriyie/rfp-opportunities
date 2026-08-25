import logging

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

logger = logging.getLogger(__name__)

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

Base = declarative_base()


def get_db():
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def sync_schema():
    """Add any columns that exist on the ORM models but not on the actual
    tables yet. `Base.metadata.create_all()` only creates missing tables, it
    never alters existing ones, so a column added to a model after the table
    already exists in production (like `opportunities.deadline`) needs this
    to actually show up -- there's no Alembic in this project. Only ever
    adds columns; never drops or alters existing ones.
    """
    inspector = inspect(engine)
    for table in Base.metadata.sorted_tables:
        if not inspector.has_table(table.name):
            continue  # create_all() will create it fresh, already up to date

        existing_columns = {col["name"] for col in inspector.get_columns(table.name)}
        for column in table.columns:
            if column.name in existing_columns:
                continue

            col_type = column.type.compile(dialect=engine.dialect)
            ddl = f"ALTER TABLE {table.name} ADD COLUMN {column.name} {col_type}"
            logger.info(f"Schema sync: {ddl}")
            with engine.begin() as conn:
                conn.execute(text(ddl))
