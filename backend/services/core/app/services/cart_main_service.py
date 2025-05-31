from app.services.base_service import BaseService
from app.services.cart_service import CartService
from typing import Annotated, List, Optional
from fastapi import Depends
from uuid import UUID
from app.domain.schemas.cart_schema import CartItemResponseSchema
from loguru import logger

class CartMainService(BaseService):
    def __init__(self, cart_service: Annotated[CartService, Depends()]):
        super().__init__()
        self.cart_service = cart_service

    async def add_item(self, website_id: UUID, buyer_id: UUID, item_id: UUID) -> CartItemResponseSchema:
        cart_item = await self.cart_service.add_item_to_cart(website_id, buyer_id, item_id)
        logger.info(f"Cart item added: {cart_item.id}")
        return CartItemResponseSchema(
        id= cart_item.id, 
        website_id= cart_item.website_id, 
        item_id= cart_item.item_id, 
        quantity= cart_item.quantity, 
        added_at= cart_item.added_at,
        expires_at= cart_item.expires_at
        )


    async def get_cart_items(self, buyer_id: UUID) -> List[CartItemResponseSchema]:
        logger.info(f"Getting cart for buyer: {buyer_id}")
        items = await self.cart_service.get_cart_items(buyer_id)
        return [CartItemResponseSchema(
          id= item.id, 
          website_id= item.website_id, 
          item_id= item.item_id, 
          quantity= item.quantity, 
          added_at= item.added_at,
          expires_at= item.expires_at  
        ) for item in items]  

    async def remove_one_from_cart(self, cart_item_id: UUID) -> dict:
        updated_item = await self.cart_service.remove_one_from_cart(cart_item_id)
        if updated_item is None:
            return {"message": "Item removed from cart."}
        else:
            return {"message": "Item quantity decreased by one."}
    