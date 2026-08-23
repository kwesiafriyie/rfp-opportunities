from sqlalchemy import Column, Integer, String, DateTime, func
from ..core.database import Base

class Opportunity(Base):
    __tablename__ = "opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    date = Column(String)
    description = Column(String)
    link = Column(String)
    type = Column(String)
    source = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "description": self.description,
            "link": self.link,
            "type": self.type,
            "source": self.source,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
