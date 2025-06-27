from typing import Annotated
from app.services.payment_main_service import PaymentMainService
from fastapi import APIRouter, Depends, Query
from uuid import UUID
from app.services.auth_services.auth_service import get_current_buyer, get_current_user
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger

payment_router = APIRouter()

@payment_router.post("/order_request")
async def request_order_payment(
    current_buyer: Annotated[TokenDataSchema, Depends(get_current_buyer)],
    payment_main_service: Annotated[PaymentMainService, Depends()] ,
):
    logger.info(f"Buyer {current_buyer.buyer_id} is starting to pay...")
    payment_url = await payment_main_service.initiate_order_payment(current_buyer.buyer_id)
    return {"payment_url": payment_url}


@payment_router.get("/order_payment/callback/{order_id}")
async def payment_callback(payment_main_service: Annotated[PaymentMainService, Depends()],
    order_id: UUID,
    authority: str = Query(..., alias="Authority"),  
    status: str = Query(..., alias="Status")   
):
    return await payment_main_service.confirm_order_payment(order_id, authority, status)


@payment_router.post("/plan_payment_request/{plan_id}")
async def request_plan_payment(
    plan_id: UUID,
    website_id: UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    payment_main_service: Annotated[PaymentMainService, Depends()],
):
    logger.info(f"user {current_user.user_id} is starting plan payment for plan {plan_id}...")
    payment_url = await payment_main_service.initiate_plan_payment(website_id, plan_id)
    return {"payment_url": payment_url}



@payment_router.get("/plan_payment/callback")
async def plan_payment_callback(
    payment_main_service: Annotated[PaymentMainService, Depends()],
    website_id: UUID = Query(...),
    plan_id: UUID = Query(...),
    authority: str = Query(..., alias="Authority"),
    status: str = Query(..., alias="Status"),

):
    return await payment_main_service.confirm_plan_payment(website_id, plan_id, authority, status)
