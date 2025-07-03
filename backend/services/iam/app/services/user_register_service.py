from typing import Annotated
from loguru import logger
from fastapi import Depends, HTTPException, status
from app.domain.schemas.user_schema import (
    UserCreateSchema,
    UserResponseSchema,
    VerifyOTPSchema,
    VerifyOTPResponseSchema,
    ResendOTPResponseSchema,
    ResendOTPSchema
)
from app.services.auth_services.auth_service import AuthService
from app.services.auth_services.otp_service import OTPService
from app.services.base_service import BaseService
from app.services.user_service import UserService
from app.utils import helper

class RegisterService(BaseService):
    def __init__(
        self,
        user_service: Annotated[UserService, Depends()],
        otp_service: Annotated[OTPService, Depends()],
        auth_service: Annotated[AuthService, Depends()],
    ) -> None:
        super().__init__()

        self.user_service = user_service
        self.otp_service = otp_service
        self.auth_service = auth_service

    async def register_user(self, user: UserCreateSchema) -> UserResponseSchema:
        existing_email = await self.user_service.get_user_by_email(user.email)

        if existing_email:
            logger.error(f"User with email {user.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists"
            )
        
        if user.password != user.confirm_password:
            raise HTTPException(status_code=400, detail='Password confirmation does not match')
        
        domain = user.email.split("@")[-1]
        if domain not in helper.ALLOWED_DOMAINS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only emails from {', '.join(helper.ALLOWED_DOMAINS)} are allowed"
            )
        

        new_user = await self.user_service.create_user(user)
        otp = self.otp_service.send_otp(new_user.email)
        logger.info(f"User with email: {user.email} created successfully")
        return UserResponseSchema(
            first_name= new_user.first_name ,
            last_name= new_user.last_name ,
            email= new_user.email,
            is_verified=new_user.is_verified,
            message = 'User Created Successfully, OTP Sent To The Email✅'
        )
    async def verify_user(
        self, verify_user_schema: VerifyOTPSchema
    ) -> VerifyOTPResponseSchema:
        if not self.otp_service.verify_otp(
            verify_user_schema.email, verify_user_schema.otp
        ):
            logger.error(f"Invalid OTP for email {verify_user_schema.email}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        user = await self.user_service.get_user_by_email(
            verify_user_schema.email
        )

        await self.user_service.update_verified_status(user.user_id, {"is_verified": True})

        logger.info(f"User with email{verify_user_schema.email} verified✅")
        return VerifyOTPResponseSchema(
            verified=True, message="User Verified Successfully"
        )

    async def resend_otp(
        self, resend_otp_schema: ResendOTPSchema
    ) -> ResendOTPResponseSchema:
        existing_user = await self.user_service.get_user_by_email(
            resend_otp_schema.email
        )
        if not existing_user:
            logger.error(f"User with email {resend_otp_schema.email} does not exist")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist"
            )

        # if existing_user.is_verified:
        #     logger.error(f"User with email {resend_otp_schema.email} already verified")
        #     raise HTTPException(
        #         status_code=status.HTTP_400_BAD_REQUEST, detail="User already verified"
        #     )

        if self.otp_service.check_exist(resend_otp_schema.email):
            logger.error(f"OTP for email {resend_otp_schema.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="OTP already exists"
            )

        otp = self.otp_service.send_otp(resend_otp_schema.email)

        logger.info(f"OTP resent to email {resend_otp_schema.email}")
        return ResendOTPResponseSchema(
            email=resend_otp_schema.email,
            OTP=otp,
            message="OTP sent to email",
        )   

    async def verify_otp_forget_password(
        self, verify_user_schema: VerifyOTPSchema
    ) :
        if not self.otp_service.verify_otp(
            verify_user_schema.email, verify_user_schema.otp
        ):
            logger.error(f"Invalid OTP for email {verify_user_schema.email}❌")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP❌"
            )

        user = await self.user_service.get_user_by_email(verify_user_schema.email)
        await self.user_service.update_verified_status(user.user_id, {"can_reset_password": True})

        logger.info(f"User with email{verify_user_schema.email} Requested for password reseting")
        return {"status_code": 200, "message": "OTP Verified Successfully"}
    