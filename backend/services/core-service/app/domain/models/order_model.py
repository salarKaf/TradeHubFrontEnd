from sqlalchemy import Column, String, Text, ForeignKey, BigInteger, TIMESTAMP, func, Boolean, DECIMAL, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from uuid import uuid4
import datetime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
Base = declarative_base()



class Website(Base):
    __tablename__ = "websites"

    website_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    business_name = Column(String(255), nullable=False)
    website_url = Column(String(255), unique=True)
    custom_domain = Column(String(255), unique=True)
    logo_url = Column(String(255), nullable=True)
    banner_image = Column(String(255), nullable=True)
    welcome_text = Column(Text, nullable=True)
    guide_page = Column(Text, nullable=True)
    social_links = Column(JSONB, nullable=True)
    faqs = Column(JSONB, nullable=True)
    total_sales = Column(BigInteger, default=0)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    cart_items = relationship("CartItem", back_populates="website")



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

    cart_items = relationship("CartItem", back_populates="item")
   

class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.website_id", ondelete="CASCADE"), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), nullable=False)  
    item_id = Column(UUID(as_uuid=True), ForeignKey("items.item_id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    added_at = Column(TIMESTAMP, default=datetime.utcnow)
    expires_at = Column(TIMESTAMP, nullable=True)

    website = relationship("Website", back_populates="cart_items")
    item = relationship("Item", back_populates="cart_items")

class Order(Base):
    __tablename__ = 'orders'

    order_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    website_id = Column(UUID(as_uuid=True), ForeignKey('websites.website_id', ondelete='CASCADE'), nullable=False)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey('buyers.buyer_id', ondelete='CASCADE'), nullable=False)
    status = Column(String(20), nullable=False, default='Pending')
    total_price = Column(DECIMAL(10,2), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = 'order_items'

    order_item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.order_id', ondelete='CASCADE'), nullable=False)
    item_id = Column(UUID(as_uuid=True), ForeignKey('items.item_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)

    order = relationship("Order", back_populates="order_items")
