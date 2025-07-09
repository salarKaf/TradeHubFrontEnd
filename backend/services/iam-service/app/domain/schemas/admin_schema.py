from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional
from uuid import UUID


class AdminLoginSchema(BaseModel):
    email: str
    password: str

class ForgetPasswordSchema(BaseModel):
    email: str
    password: str
    confirm_password: str    


class ResetPasswordSchema(BaseModel):
    email: str
    otp: str
    new_password: str
    confirm_password: str    

class VerifyOTPSchema(BaseModel):
    email: str
    otp: str
    model_config = ConfigDict(from_attributes=True)

class VerifyOTPResponseSchema(BaseModel):
    verified: bool
    message: str
class ResendOTPSchema(BaseModel):
    email: str

class ResendOTPResponseSchema(BaseModel):
    email: str
    message: str   