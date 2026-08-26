import json

from sqlalchemy import Column, Integer, String, Text, DateTime, func
from ..core.database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    link = Column(String, unique=True, index=True, nullable=False)
    excerpt = Column(Text)  # short, card-level summary -- derived from `description` when one is available
    description = Column(Text, nullable=True)  # full opportunity description, for the detail view; None if a source doesn't provide one
    published_at = Column(DateTime(timezone=True))
    deadline = Column(DateTime(timezone=True), nullable=True)  # normalized, always UTC -- the value everything filters/sorts/expires on
    deadline_raw = Column(String, nullable=True)  # the source's own unparsed deadline text, kept for debugging/audit only
    matched_keywords = Column(String)
    organization = Column(String, nullable=True)  # the issuing body (e.g. "UNDP", "Ministry of Finance") -- distinct from `source`, the site it was scraped from
    country = Column(String, nullable=True)  # normalized beneficiary country/territory
    reference = Column(String, nullable=True)  # the source's own reference/ID string, for display
    opportunity_type = Column(String, nullable=True)  # normalized procurement instrument, e.g. "Individual Consultant", "Request for Proposal"
    sector = Column(String, nullable=True)  # normalized sector bucket, e.g. "Technology", "Finance & Audit"; None if unclassified
    eligibility = Column(Text, nullable=True)  # common concept, source-populated where applicable (e.g. UNGM's registration level)
    contact_info = Column(Text, nullable=True)  # free-text contact block (email/name lines), where a source exposes one
    documents = Column(Text, nullable=True)  # JSON list of {"label", "url"} -- links out to the source's own documents, never downloaded/hosted here
    extra = Column(Text, nullable=True)  # JSON list of {"label", "value"} for source-specific fields that don't warrant their own column (UNSPSC category, and future per-source fields like AfDB's funding source/implementing agency)
    ingestion_method = Column(String, nullable=True, default="automated")  # "automated" | "manual" -- set once at creation, never changed by later edits. NULL on rows that predate this column; treated as "automated" everywhere it's read, since every row before manual intake existed was scraped.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "title": self.title,
            "link": self.link,
            "excerpt": self.excerpt,
            "description": self.description,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "matched_keywords": self.matched_keywords.split(",") if self.matched_keywords else [],
            "organization": self.organization,
            "country": self.country,
            "reference": self.reference,
            "opportunity_type": self.opportunity_type,
            "sector": self.sector,
            "eligibility": self.eligibility,
            "contact_info": self.contact_info,
            "documents": json.loads(self.documents) if self.documents else [],
            "extra": json.loads(self.extra) if self.extra else [],
            "ingestion_method": self.ingestion_method or "automated",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
