from sqlalchemy import Column, String, Text, ForeignKey, BigInteger, TIMESTAMP, func, Boolean, DECIMAL, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()


class Website(Base):
    __tablename__ = "websites"

    website_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    business_name = Column(String(255), nullable=False)
    logo_url = Column(String(255), nullable=True)
    banner_image = Column(String(255), nullable=True)
    welcome_text = Column(Text, nullable=True)
    store_policy = Column(Text, nullable=True)
    store_slogan = Column(Text, nullable=True)
    guide_page = Column(Text, nullable=True)
    social_links = Column(JSONB, nullable=True)
    faqs = Column(JSONB, nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    website_categories = relationship("WebsiteCategory", back_populates="website", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="website", cascade="all, delete")


class WebsiteSubcategory(Base):
    __tablename__ = "website_subcategories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    parent_category_id = Column(UUID(as_uuid=True), ForeignKey("website_categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    parent_category = relationship("WebsiteCategory", back_populates="subcategories")

class WebsiteCategory(Base):
    __tablename__ = "website_categories"

    id = Column(UUID, primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    website = relationship("Website", back_populates="website_categories")   
    subcategories = relationship("WebsiteSubcategory", back_populates="parent_category", cascade="all, delete-orphan")
     

class Item(Base):
    __tablename__ = 'items'

    item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey('websites.website_id', ondelete='CASCADE'), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey('website_categories.id', ondelete='CASCADE'), nullable=False)
    subcategory_id = Column(UUID(as_uuid=True), ForeignKey('website_subcategories.id', ondelete='SET NULL'), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(DECIMAL(10, 2), nullable=False)
    discount_price = Column(DECIMAL(10, 2), nullable=True)
    discount_active = Column(Boolean, default=False)
    discount_expires_at = Column(TIMESTAMP, nullable=True)
    delivery_url = Column(String(255), nullable=False)
    post_purchase_note = Column(Text, nullable=True)
    stock = Column(Integer, nullable=True)
    is_available = Column(Boolean, default=True)
    image_url = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, default=datetime.utcnow) 

    reviews = relationship("Review", back_populates="item", cascade="all, delete") 


class Buyer(Base):
    __tablename__ = 'buyers'

    buyer_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    website_id = Column(UUID(as_uuid=True), ForeignKey('websites.website_id', ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    password = Column(Text, nullable=False)
    phone_number = Column(String(20), nullable=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    can_reset_password = Column(Boolean, default=False, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp(), nullable=False)

    reviews = relationship("Review", back_populates="buyer", cascade="all, delete")



class Review(Base):
    __tablename__ = "reviews"

    review_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("buyers.buyer_id"), nullable=False)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id"), nullable=False)
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.item_id"), nullable=False)
    rating = Column(Integer, nullable=False) 
    text = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    buyer = relationship("Buyer", back_populates="reviews")
    website = relationship("Website", back_populates="reviews")
    item = relationship("Item", back_populates="reviews")