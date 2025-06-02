from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Annotated
from uuid import UUID
from app.domain.schemas.order_schema import OrderCreateSchema, OrderResponseSchema
from app.domain.schemas.token_schema import TokenDataSchema
from app.services.order_main_service import OrderMainService
from app.services.auth_services.auth_service import get_current_buyer
from loguru import logger

order_router = APIRouter()

@order_router.post("/create_order", response_model=List[OrderResponseSchema], status_code=status.HTTP_201_CREATED)
async def create_order(
    website_id: UUID,
    current_buyer: Annotated[TokenDataSchema, Depends(get_current_buyer)],
    order_main_service: Annotated[OrderMainService, Depends()]
):
    if current_buyer.website_id != website_id:
        raise HTTPException(status_code=403, detail="Unauthorized access to this website.")
    
    logger.info(f"Buyer {current_buyer.buyer_id} creating order for website {website_id}")
    return await order_main_service.create_order(current_buyer.buyer_id, website_id)
