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
    matched_keywords = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "title": self.title,
            "link": self.link,
            "excerpt": self.excerpt,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "matched_keywords": self.matched_keywords.split(",") if self.matched_keywords else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
