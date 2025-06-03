from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime
from decimal import Decimal

class CartItemCreateSchema(BaseModel):
  website_id: UUID
  item_id: UUID

class CartItemResponseSchema(BaseModel):
  id: UUID
  website_id: UUID
  item_id: UUID
  quantity: int
  added_at: datetime
  expires_at: Optional[datetime]
  price: Decimal           
  total_price: Decimal
  
  class Config:
    from_attributes = True


class MessageResponse(BaseModel):
  message: str