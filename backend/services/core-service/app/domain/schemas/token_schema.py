from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID

class TokenSchema(BaseModel):
    access_token: str
    token_type: str


class TokenDataSchema(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: str
    class Config:
        from_attributes = True


class AdminTokenDataSchema(BaseModel):
    admin_id: UUID
    email: str
    class Config:
        from_attributes = True        


class BuyerTokenDataSchema(BaseModel):
    buyer_id: UUID
    name: str
    email: str
    class Config:
        from_attributes = True
