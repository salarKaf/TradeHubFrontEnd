from sqlalchemy import Column, String, Text, ForeignKey, BigInteger, TIMESTAMP, func, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
import datetime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password= Column(Text, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    can_reset_password = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

class StoreOwner(Base):
    __tablename__ = "store_owners"

    id = Column(UUID, primary_key=True, default=uuid4)
    website_id = Column(UUID, ForeignKey("websites.website_id"), nullable=False)
    user_id = Column(UUID, ForeignKey("users.user_id"), nullable=False)
    joined_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    website = relationship("Website", backref="store_owners")
    user = relationship("User", backref="store_owners")

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(UUID, primary_key=True, default= uuid4)
    name = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())

    websites = relationship("Website", back_populates="category")

class Website(Base):
    __tablename__ = "websites"

    website_id = Column(UUID, primary_key=True, default=uuid4)
    business_name = Column(String(255), nullable=False)
    category_id = Column(UUID, ForeignKey("categories.category_id"), nullable=True)
    website_url = Column(String(255), unique=True)
    custom_domain = Column(String(255), unique=True)
    logo_url = Column(String(255), nullable=True)
    banner_image = Column(String(255), nullable=True)
    welcome_text = Column(Text, nullable=True)
    qa_page = Column(Text, nullable=True)
    guide_page = Column(Text, nullable=True)
    social_links = Column(JSONB, nullable=True)
    total_sales = Column(BigInteger, default=0)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    category = relationship("Category", back_populates="websites")

    