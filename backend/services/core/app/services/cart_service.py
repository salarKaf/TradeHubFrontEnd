from app.infrastructure.repositories.cart_repository import CartRepository
from app.infrastructure.repositories.item_repository import ItemRepository
from typing import Annotated, List
from app.domain.models.buyer_model import CartItem
from uuid import UUID
from fastapi import Depends
from loguru import logger
from fastapi import HTTPException
from datetime import datetime
from app.domain.schemas.cart_schema import CartItemResponseSchema
from decimal import Decimal

class CartService:    
  def __init__(
        self,  
        cart_repository: Annotated[CartRepository, Depends()],
        item_repository: Annotated[ItemRepository, Depends()],):
    
    self.cart_repository = cart_repository
    self.item_repository = item_repository

  async def add_item_to_cart(self, website_id: UUID, buyer_id: UUID, item_id: UUID) -> CartItem:

    cart_item = self.cart_repository.add_item(website_id, buyer_id, item_id)
    return cart_item

  # async def get_cart_items(self, buyer_id: UUID) -> List[CartItem]:
  #   return self.cart_repository.get_cart_items_by_buyer(buyer_id)
  

  def calculate_price(self, item, quantity) -> Decimal:
    logger.info("Calculating...")
    now = datetime.utcnow()
    if item.discount_active and item.discount_expires_at and item.discount_expires_at > now:
        final_price = item.discount_price or item.price
    else:
        final_price = item.price
    return final_price * quantity


       
  async def get_cart_items(self, buyer_id: UUID) -> List[CartItem]:
    logger.info(f"Getting my cart for buyer: {buyer_id}")
    return self.cart_repository.get_cart_items_by_buyer(buyer_id)
   


  async def remove_one_from_cart(self, cart_item_id: UUID):
    return self.cart_repository.remove_one_from_cart(cart_item_id)

  async def delete_cart_item(self, cart_item_id: UUID):
    success = self.cart_repository.delete_cart_item(cart_item_id)
    if not success:
      logger.error(f"Cart item {cart_item_id} not found to delete")
      raise HTTPException(status_code=404, detail="Cart item not found")
    return success