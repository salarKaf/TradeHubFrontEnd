from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime


class BuyerBase(BaseModel):
    website_id: UUID
    name: str
    email: str


class BuyerCreateSchema(BuyerBase):
    password: str
    confirm_password: str


class BuyerResponseSchema(BuyerBase):
    message: str


class VerifyOTPSchema(BaseModel):
    website_id: UUID
    email: str
    otp: str
    model_config = ConfigDict(from_attributes=True)


class VerifyOTPResponseSchema(BaseModel):
    verified: bool
    message: str


class BuyerLoginSchema(BaseModel):
    website_id: UUID
    email: str
    password: str


class BuyerInfoSchema(BaseModel):
    buyer_id: UUID
    website_id: UUID
    name: str
    email: str

    class Config:
        from_attributes = True


class ResendOTPSchema(BaseModel):
    website_id: UUID
    email: str


class ResendOTPResponseSchema(BaseModel):
    email: str
    message: str


class UpdateBuyerInfoSchema(BaseModel):
    password: Optional[str] = None
    confirm_password: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None


class ResetPasswordSchema(BaseModel):
    website_id: UUID
    email: str
    otp: str
    new_password: str
    confirm_password: str


class ForgetPasswordSchema(BaseModel):
    website_id: UUID
    website_id: UUID
    email: str
    password: str
    confirm_password: str
