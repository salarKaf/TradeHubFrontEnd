from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime
from decimal import Decimal

class OrderCreateSchema(BaseModel):
    website_id: UUID
    buyer_id: UUID

class OrderResponseSchema(BaseModel):
    order_id: UUID
    website_id: UUID
    item_id: UUID
    buyer_id: UUID
    total_price: Decimal
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

