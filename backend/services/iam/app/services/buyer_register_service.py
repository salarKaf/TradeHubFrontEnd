from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status

from app.domain.schemas.buyer_schema import (
    BuyerCreateSchema,
    BuyerResponseSchema,
    VerifyOTPSchema,
    VerifyOTPResponseSchema,
    ResendOTPResponseSchema,
    ResendOTPSchema
)
from app.services.auth_services.auth_service import AuthService
from app.services.auth_services.otp_service import OTPService
from app.services.base_service import BaseService
from app.services.buyer_service import BuyerService


class RegisterService(BaseService):
    def __init__(
        self,
        buyer_service: Annotated[BuyerService, Depends()],
        otp_service: Annotated[OTPService, Depends()],
        auth_service: Annotated[AuthService, Depends()],
    ) -> None:
        super().__init__()

        self.buyer_service = buyer_service
        self.otp_service = otp_service
        self.auth_service = auth_service

    async def register_buyer(self, buyer: BuyerCreateSchema) -> BuyerResponseSchema:
        # Check if the email already exists
        existing_email = await self.buyer_service.get_buyer_by_email(buyer.email)

        if existing_email:
            logger.error(f"Buyer with email {buyer.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Buyer already exists"
            )
        
        if buyer.password != buyer.confirm_password:
            raise HTTPException(status_code=400, detail='Password confirmation does not match')

        # Create new buyer
        new_buyer = await self.buyer_service.create_buyer(buyer)

        # Send OTP to new buyer
        otp = self.otp_service.send_otp(new_buyer.email)

        logger.info(f"Buyer with email: {buyer.email} created successfully")
        return BuyerResponseSchema(
            name=new_buyer.name,
            email=new_buyer.email,
            message='Buyer Created Successfully, OTP Sent To The Email✅'
        )

    async def verify_buyer(
        self, verify_buyer_schema: VerifyOTPSchema
    ) -> VerifyOTPResponseSchema:
        # Verify OTP
        if not self.otp_service.verify_otp(
            verify_buyer_schema.email, verify_buyer_schema.otp
        ):
            logger.error(f"Invalid OTP for email {verify_buyer_schema.email}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        # Get buyer and update their verified status
        buyer = await self.buyer_service.get_buyer_by_email(verify_buyer_schema.email)
        await self.buyer_service.update_verified_status(buyer.buyer_id, {"is_verified": True})

        logger.info(f"Buyer with email {verify_buyer_schema.email} verified✅")
        return VerifyOTPResponseSchema(
            verified=True, message="Buyer Verified Successfully"
        )

    async def resend_otp(
        self, resend_otp_schema: ResendOTPSchema
    ) -> ResendOTPResponseSchema:
        # Get existing buyer by email
        existing_buyer = await self.buyer_service.get_buyer_by_email(resend_otp_schema.email)
        
        if not existing_buyer:
            logger.error(f"Buyer with email {resend_otp_schema.email} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Buyer does not exist"
            )

        # If buyer is already verified, no need to resend OTP
        if existing_buyer.is_verified:
            logger.error(f"Buyer with email {resend_otp_schema.email} already verified")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Buyer already verified"
            )

        # If OTP already exists, prevent sending another one
        if self.otp_service.check_exist(resend_otp_schema.email):
            logger.error(f"OTP for email {resend_otp_schema.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already exists"
            )

        # Send new OTP
        otp = self.otp_service.send_otp(resend_otp_schema.email)

        logger.info(f"OTP resent to email {resend_otp_schema.email}")
        return ResendOTPResponseSchema(
            email=resend_otp_schema.email,
            OTP=otp,
            message="OTP sent to email",
        )

    async def verify_otp_forget_password(
        self, verify_buyer_schema: VerifyOTPSchema
    ) -> dict:
        # Verify OTP for forget password flow
        if not self.otp_service.verify_otp(
            verify_buyer_schema.email, verify_buyer_schema.otp
        ):
            logger.error(f"Invalid OTP for email {verify_buyer_schema.email}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        # Get buyer and update their reset password status
        buyer = await self.buyer_service.get_buyer_by_email(verify_buyer_schema.email)
        await self.buyer_service.update_verified_status(buyer.buyer_id, {"can_reset_password": True})

        logger.info(f"Buyer with email {verify_buyer_schema.email} requested for password reset")
        return {"status_code": 200, "message": "OTP Verified Successfully"}
