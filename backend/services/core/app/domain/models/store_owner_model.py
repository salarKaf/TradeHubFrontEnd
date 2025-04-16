from sqlalchemy import Column, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.postgres_db.database import Base
from uuid import uuid4
import datetime

class StoreOwner(Base):
    __tablename__ = "store_owners"

    id = Column(UUID, primary_key=True, default=uuid4)
    website_id = Column(UUID, ForeignKey("websites.website_id"), nullable=False)
    user_id = Column(UUID, ForeignKey("users.user_id"), nullable=False)
    joined_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    website = relationship("Website", backref="store_owners")
    user = relationship("User", backref="store_owners")


