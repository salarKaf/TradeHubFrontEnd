from app.infrastructure.repositories.cart_repository import CartRepository
from typing import Annotated, List
from fastapi import HTTPException
from app.domain.models.buyer_model import CartItem
from uuid import UUID
from fastapi import Depends
from loguru import logger

class CartService:    
  def __init__(self, cart_repository: Annotated[CartRepository, Depends()]):
    self.cart_repository = cart_repository

  async def add_item_to_cart(self, website_id: UUID, buyer_id: UUID, item_id: UUID) -> CartItem:

    cart_item = self.cart_repository.add_item(website_id, buyer_id, item_id)
    return cart_item

  async def get_cart_items(self, buyer_id: UUID) -> List[CartItem]:
      
    return self.cart_repository.get_cart_items_by_buyer(buyer_id)
  

  async def remove_one_from_cart(self, cart_item_id: UUID):
    return self.cart_repository.remove_one_from_cart(cart_item_id)
