from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID
from typing import List

class AdminLoginSchema(BaseModel):
    email: str
    password: str

class ShopPlanStatsSchema(BaseModel):
    total_active: int
    basic_active: int
    pro_active: int



class TopWebsiteSchema(BaseModel):
    website_id: str
    website_name: str
    is_active: bool
    owner_email: Optional[str]
    plan_name: Optional[str]
    total_income: int
    total_orders: int    



class WebsiteListSchema(BaseModel):
    website_id: UUID
    website_name: str
    is_active: bool
    created_at: datetime
    plan_name: Optional[str]
    owner_emails: Optional[str]
