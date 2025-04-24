from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime


class BuyerBase(BaseModel):
    name: str
    email: str


class BuyerCreateSchema(BuyerBase):
    password: str
    confirm_password: str


class BuyerResponseSchema(BuyerBase):
    message: str


class VerifyOTPSchema(BaseModel):
    email: str
    otp: str
    model_config = ConfigDict(from_attributes=True)


class VerifyOTPResponseSchema(BaseModel):
    verified: bool
    message: str


class BuyerLoginSchema(BaseModel):
    email: str
    password: str


class BuyerInfoSchema(BaseModel):
    buyer_id: UUID
    name: str
    email: str

    class Config:
        from_attributes = True


class ResendOTPSchema(BaseModel):
    email: str


class ResendOTPResponseSchema(BaseModel):
    email: str
    message: str


class UpdateBuyerInfoSchema(BaseModel):
    password: Optional[str]
    confirm_password: Optional[str]
    name: Optional[str]
    email: Optional[str]
    phone_number: Optional[str]


class ResetPasswordSchema(BaseModel):
    email: str
    otp: str
    new_password: str
    confirm_password: str


class ForgetPasswordSchema(BaseModel):
    email: str
    password: str
    confirm_password: str
