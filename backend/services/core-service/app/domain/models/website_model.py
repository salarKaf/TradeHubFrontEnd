from sqlalchemy import Column, String, Text, ForeignKey, BigInteger, TIMESTAMP, func, Boolean, DECIMAL, Integer
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

class WebsiteOwner(Base):
    __tablename__ = "website_owners"

    id = Column(UUID, primary_key=True, default=uuid4)
    website_id = Column(UUID, ForeignKey("websites.website_id"), nullable=False)
    user_id = Column(UUID, ForeignKey("users.user_id"), nullable=False)
    joined_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    website = relationship("Website", backref="website_owners")
    user = relationship("User", backref="website_owners")

class WebsiteCategory(Base):
    __tablename__ = "website_categories"

    id = Column(UUID, primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
    website = relationship("Website", back_populates="website_categories")   
    subcategories = relationship("WebsiteSubcategory", back_populates="parent_category", cascade="all, delete-orphan")
     
 


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
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)

    website_categories = relationship("WebsiteCategory", back_populates="website", cascade="all, delete-orphan")

class Coupon(Base):
    __tablename__ = "coupons"

    coupon_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id"), nullable=False)
    code = Column(String, unique=True, nullable=False)  
    discount_amount = Column(DECIMAL, nullable=False)  
    expiration_date = Column(TIMESTAMP, nullable=True)
    usage_limit = Column(Integer, nullable=True) 
    times_used = Column(Integer, default=0) 
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class WebsiteSubcategory(Base):
    __tablename__ = "website_subcategories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    parent_category_id = Column(UUID(as_uuid=True), ForeignKey("website_categories.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)

    parent_category = relationship("WebsiteCategory", back_populates="subcategories")


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
    discount_percent = Column(Integer, default=0)
    discount_expires_at = Column(TIMESTAMP, nullable=True)
    delivery_url = Column(String(255), nullable=False)
    post_purchase_note = Column(Text, nullable=True)
    stock = Column(Integer, nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)    


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    plan_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = Column(String(50), unique=True, nullable=False)
    item_limit = Column(Integer, nullable=False)
    allow_discount = Column(Boolean, default=False)
    allow_analytics = Column(Boolean, default=False) 
    price = Column(DECIMAL(10, 2), nullable=False)  


class WebsitePlan(Base):
    __tablename__ = "website_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id", ondelete="CASCADE"), nullable=False)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("subscription_plans.plan_id"), nullable=False)
    activated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    expires_at = Column(TIMESTAMP, nullable=True)
    is_active = Column(Boolean, default=True) 

    plan = relationship("SubscriptionPlan", backref="website_plans")   



class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id"), nullable=False)
    message = Column(String(512), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, nullable=False)