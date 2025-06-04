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

    async def create_order_from_cart(self, buyer_id: UUID, website_id: UUID) ->Order:
        logger.info(f"Creating order for buyer {buyer_id} on website {website_id}...")
        order = self.order_repository.create_order_from_cart(buyer_id, website_id)
        self.cart_repository.clear_cart(buyer_id)
        return order

    async def get_orders_by_buyer(self, buyer_id: UUID) -> List[Order]:
        logger.info(f"Getting order for buyer: {buyer_id}")
        return self.order_repository.get_orders_by_buyer(buyer_id)
    

    async def get_order_by_id(self, order_id: UUID) -> Order:
        logger.info(f"Getting order with id buyer: {order_id}")
        return self.order_repository.get_order_by_id(order_id)
    

    async def get_orders_by_website_id(self, website_id: UUID) -> List[Order]:
        logger.info(f"Getting order for website: {website_id}")
        return self.order_repository.get_orders_by_website_id(website_id)
    

    async def update_order_status(self, order_id: UUID, new_status: str) -> None:
        logger.info(f"Updating order with id: {order_id}")
        return self.order_repository.update_order_status(order_id, new_status)

    async def get_pending_order(self, buyer_id: UUID) -> Order:
        logger.info(f"Getting pending order with id buyer: {buyer_id}")
        return self.order_repository.get_pending_order(buyer_id)