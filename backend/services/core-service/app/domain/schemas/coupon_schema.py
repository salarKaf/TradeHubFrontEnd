from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID
class CouponCreateSchema(BaseModel):
    website_id: UUID
    code: str
    discount_amount: Decimal
    expiration_date: Optional[datetime] = None
    usage_limit: Optional[int] = None

class CouponResponseSchema(BaseModel):
    id: UUID
    website_id: UUID
    code: str
    discount_amount: Decimal
    expiration_date: Optional[datetime] = None
    usage_limit: Optional[int]
    times_used: int
    created_at: datetime