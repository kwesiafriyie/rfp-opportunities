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

    # --- KPMG Fit groundwork (see the "KPMG Fit Feasibility" assessment) ---
    # Deliberately inert: nothing computes or writes these yet -- no scoring
    # logic, no LLM calls, no UI reads them. Added now only so the eventual
    # matching feature is a data-population problem, not a schema migration,
    # once it's actually built. `fit_score`/`fit_tier` are dedicated columns
    # (not folded into `fit_analysis`) because a future filter/sort needs to
    # query them directly, the same reason `sector`/`opportunity_type` are
    # dedicated columns rather than living in `extra`.
    fit_status = Column(String, nullable=True)  # "available" | "pending" | "insufficient_information" | "unavailable" -- null means the same as "pending" (not yet analyzed); a distinct column (not inferred from fit_score being null) because "pending" and "insufficient_information" are different, both score-less, states the UI must tell apart
    fit_score = Column(Integer, nullable=True)  # 0-100, only meaningful when fit_status == "available"; deterministic function of fit_analysis's matched/gap tags -- never an LLM-emitted number directly
    fit_tier = Column(String, nullable=True)  # "Strong" | "Moderate" | "Weak", only meaningful when fit_status == "available" -- a capability-fit tier, never a win-probability claim
    # JSON object, only meaningful when fit_status == "available":
    # {"breakdown": {"capability_technical_fit": {"score": 32, "max": 35}, "industry_sector_fit": {...}, "technology_platform_fit": {...}, "experience_track_record_fit": {...}, "eligibility_geographic_fit": {...}, "pursuit_feasibility": {...}},
    #  "matched_capabilities": [...], "gaps": [...], "explanation": "...", "content_hash": "...", "analyzed_at": "..."}
    # Matches the read-only detail-view fields, so it follows the same
    # JSON-bag pattern as `documents`/`extra` above rather than one column
    # per breakdown dimension. `content_hash` is a hash of whatever fields
    # the analysis reads (title + description + requirements-bearing
    # fields), so a future re-analysis step can skip opportunities whose
    # analyzed content hasn't changed.
    fit_analysis = Column(Text, nullable=True)

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
            "fit_status": self.fit_status,
            "fit_score": self.fit_score,
            "fit_tier": self.fit_tier,
            "fit_analysis": json.loads(self.fit_analysis) if self.fit_analysis else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
