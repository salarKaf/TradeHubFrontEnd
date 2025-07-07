from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID


class AdminLoginSchema(BaseModel):
    email: str
    password: str

class ShopPlanStatsSchema(BaseModel):
    total_active: int
    basic_active: int
    pro_active: int