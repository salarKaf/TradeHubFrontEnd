from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

class CartItemCreateSchema(BaseModel):
    website_id: UUID
    item_id: UUID
    quantity: int

class CartItemResponseSchema(BaseModel):
    id: UUID
    website_id: UUID
    item_id: UUID
    quantity: int
    added_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True
