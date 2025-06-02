from uuid import UUID
from typing import List, Annotated
from fastapi import HTTPException, Depends
from loguru import logger

from app.infrastructure.repositories.order_repository import OrderRepository
from app.infrastructure.repositories.cart_repository import CartRepository
from app.domain.models.order_model import Order

class OrderService:
    def __init__(
        self,
        order_repository: Annotated[OrderRepository, Depends()],
        cart_repository: Annotated[CartRepository, Depends()],
    ):
        self.order_repository = order_repository
        self.cart_repository = cart_repository

    async def create_order_from_cart(self, buyer_id: UUID) -> List[Order]:
        logger.info(f"Creating order(s) for buyer {buyer_id}...")

        cart_items = self.cart_repository.get_cart_items_by_buyer(buyer_id)
        if not cart_items:
            raise HTTPException(status_code=404, detail="Cart is empty for this website.")

        orders = self.order_repository.create_orders_from_cart(cart_items)
        self.cart_repository.clear_cart(buyer_id)

        return orders
