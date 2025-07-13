from fastapi import APIRouter, Depends, status
from app.services.auth_services.auth_service import get_current_user, get_current_buyer
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger
from typing import Annotated
from app.domain.schemas.coupon_schema import CouponCreateSchema, CouponResponseSchema
from app.services.coupon_main_service import CouponMainService

coupon_router = APIRouter()

@coupon_router.post("/create_coupon", response_model=CouponResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_coupon(
    coupon_data: CouponCreateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    coupon_service: Annotated[CouponMainService, Depends()]
):
    logger.info(f"User with id: {current_user.user_id} is creating a coupon.")
    return await coupon_service.create_coupon(coupon_data)