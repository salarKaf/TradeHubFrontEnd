from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID

class UserBase(BaseModel):
    first_name: str 
    last_name: str 
    email: str   

class UserCreateSchema(UserBase):
    password: str
    confirm_password: str

class UserResponseSchema(UserBase):
    message: str

class VerifyOTPSchema(BaseModel):
    email: str
    otp: str
    model_config = ConfigDict(from_attributes=True)

class VerifyOTPResponseSchema(BaseModel):
    verified: bool
    message: str


class UserLoginSchema(BaseModel):
    email: str
    password: str


class UserInfoSchema(BaseModel):
    user_id: UUID
    first_name: str
    last_name: str
    email: str
    class Config:
        from_attributes = True

class ResendOTPSchema(BaseModel):
    email: str

class ResendOTPResponseSchema(BaseModel):
    email: str
    message: str        


class UpdateUserInfoSchema(BaseModel):
    password: Optional[str]
    confirm_password: Optional[str]
    first_name: Optional[str]
    last_name: Optional[str]


class ResetPasswordSchema(BaseModel):
    email: str
    otp: str
    new_password: str
    confirm_password: str


class ForgetPasswordSchema(BaseModel):
    email: str
    password: str
    confirm_password: str
   