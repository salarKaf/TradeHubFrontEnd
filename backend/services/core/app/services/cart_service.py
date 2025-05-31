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

    async def add_item_to_cart(self, website_id: UUID, buyer_id: UUID, item_id: UUID, quantity: int) -> CartItem:
        if quantity <= 0:
            raise HTTPException(status_code=400, detail="Quantity must be positive")

        cart_item = self.cart_repository.add_item(website_id, buyer_id, item_id, quantity)
        return cart_item


