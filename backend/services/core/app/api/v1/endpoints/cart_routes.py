from fastapi import APIRouter, Depends, HTTPException, status
from app.services.cart_main_service import CartMainService
from app.domain.schemas.cart_schema import CartItemCreateSchema, CartItemResponseSchema
from typing import Annotated, List
from uuid import UUID
from app.services.auth_services.auth_service import get_current_buyer
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger

cart_router = APIRouter()

@cart_router.post("/add_item", response_model=CartItemResponseSchema, status_code=status.HTTP_201_CREATED)
async def add_item_to_cart(
    cart_data: CartItemCreateSchema,
    current_buyer: Annotated[TokenDataSchema, Depends(get_current_buyer)],
    cart_main_service: Annotated[CartMainService, Depends()]
):
    logger.info(f"User {current_buyer.buyer_id} adding item {cart_data.item_id} to cart")
    return await cart_main_service.add_item(
        cart_data.website_id,
        current_buyer.buyer_id,
        cart_data.item_id,
        cart_data.quantity
    )



@cart_router.get("/my_cart", response_model=List[CartItemResponseSchema], status_code=status.HTTP_200_OK)
async def get_my_cart(
    current_buyer: Annotated[TokenDataSchema, Depends(get_current_buyer)],
    cart_main_service: Annotated[CartMainService, Depends()]
):
    logger.info(f"buyer {current_buyer.buyer_id} fetching their cart items")
    return await cart_main_service.get_cart_items(current_buyer.buyer_id)