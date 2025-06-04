from typing import Annotated
from app.services.payment_main_service import PaymentMainService
from fastapi import APIRouter, Depends, Query
from uuid import UUID
from app.services.auth_services.auth_service import get_current_buyer
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger

payment_router = APIRouter()

@payment_router.post("/request")
async def request_payment(
    current_buyer: Annotated[TokenDataSchema, Depends(get_current_buyer)],
    payment_main_service: Annotated[PaymentMainService, Depends()] ,
):
    logger.info(f"Buyer {current_buyer.buyer_id} is starting to pay...")
    payment_url = await payment_main_service.initiate_payment(current_buyer.buyer_id)
    return {"payment_url": payment_url}


@payment_router.get("/payment/callback/{order_id}")
async def payment_callback(payment_main_service: Annotated[PaymentMainService, Depends()],
    order_id: UUID,
    authority: str = Query(..., alias="Authority"),  
    status: str = Query(..., alias="Status")   
):
    return await payment_main_service.confirm_payment(order_id, authority, status)