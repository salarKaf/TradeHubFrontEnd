from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class OrderCreateSchema(BaseModel):
    website_id: UUID
    buyer_id: UUID


class OrderItemResponseSchema(BaseModel):
    item_id: UUID
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True

class OrderResponseSchema(BaseModel):
    order_id: UUID
    website_id: UUID
    buyer_id: UUID
    status: str
    total_price: Decimal
    created_at: datetime
    order_items: List[OrderItemResponseSchema]

    class Config:
        from_attributes = True