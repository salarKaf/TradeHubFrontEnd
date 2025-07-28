from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class ItemCreateSchema(BaseModel):
    website_id: UUID
    category_id: UUID
    subcategory_id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    price: Decimal
    delivery_url: str
    post_purchase_note: Optional[str] = None
    stock: int

    class Config:
        from_attributes = True


class ItemResponseSchema(BaseModel):
    item_id: UUID
    website_id: UUID
    category_id: UUID
    subcategory_id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    discount_active: bool
    discount_percent: Optional[int] = None
    discount_expires_at: Optional[datetime] = None
    delivery_url: str = None
    post_purchase_note: Optional[str] = None
    stock: int
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ItemResponseWithNameSchema(BaseModel):
    item_id: UUID
    website_id: UUID
    category_id: UUID
    subcategory_id: Optional[UUID] = None
    category_name: str
    subcategory_name: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    discount_active: bool
    discount_percent: Optional[int] = None
    discount_expires_at: Optional[datetime] = None
    delivery_url: str = None
    post_purchase_note: Optional[str] = None
    stock: int
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ItemUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    discount_active: Optional[bool] = None
    discount_percent: Optional[int] = None
    discount_expires_at: Optional[datetime] = None
    delivery_url: Optional[str] = None
    post_purchase_note: Optional[str] = None
    stock: Optional[int] = None
    is_available: Optional[bool] = None

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message: str        


class NewestItemResponseSchema(BaseModel):
    item_id: UUID
    website_id: UUID
    category_id: UUID
    subcategory_id: Optional[UUID] = None
    category_name: str
    subcategory_name: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    discount_active: bool
    discount_percent: Optional[int] = None
    discount_expires_at: Optional[datetime] = None
    delivery_url: str = None
    post_purchase_note: Optional[str] = None
    sales_count: int
    stock: int
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True
class ItemResponseWithRateSchema(BaseModel):
    item_id: UUID
    website_id: UUID
    category_id: UUID
    subcategory_id: Optional[UUID] = None
    category_name: str
    subcategory_name: Optional[str] = None
    name: str
    description: Optional[str] = None
    price: Decimal
    discount_price: Optional[Decimal] = None
    discount_active: bool
    discount_percent: Optional[int] = None
    discount_expires_at: Optional[datetime] = None
    delivery_url: str = None
    rating: int
    post_purchase_note: Optional[str] = None
    stock: int
    is_available: bool
    created_at: datetime

    class Config:
        from_attributes = True
