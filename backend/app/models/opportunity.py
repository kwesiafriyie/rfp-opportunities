from sqlalchemy import Column, Integer, String, Text, DateTime, func
from ..core.database import Base


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String, index=True, nullable=False)
    title = Column(String, nullable=False)
    link = Column(String, unique=True, index=True, nullable=False)
    excerpt = Column(Text)
    published_at = Column(DateTime(timezone=True))
    deadline = Column(DateTime(timezone=True), nullable=True)  # normalized, always UTC -- the value everything filters/sorts/expires on
    deadline_raw = Column(String, nullable=True)  # the source's own unparsed deadline text, kept for debugging/audit only
    matched_keywords = Column(String)
    organization = Column(String, nullable=True)  # the issuing body (e.g. "UNDP", "Ministry of Finance") -- distinct from `source`, the site it was scraped from
    country = Column(String, nullable=True)  # normalized beneficiary country/territory
    reference = Column(String, nullable=True)  # the source's own reference/ID string, for display
    opportunity_type = Column(String, nullable=True)  # normalized procurement instrument, e.g. "Individual Consultant", "Request for Proposal"
    sector = Column(String, nullable=True)  # normalized sector bucket, e.g. "Technology", "Finance & Audit"; None if unclassified
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "title": self.title,
            "link": self.link,
            "excerpt": self.excerpt,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "matched_keywords": self.matched_keywords.split(",") if self.matched_keywords else [],
            "organization": self.organization,
            "country": self.country,
            "reference": self.reference,
            "opportunity_type": self.opportunity_type,
            "sector": self.sector,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
