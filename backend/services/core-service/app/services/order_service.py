from uuid import UUID
from typing import List, Annotated
from fastapi import Depends
from loguru import logger
from app.services.item_service import ItemService
from app.infrastructure.repositories.order_repository import OrderRepository
from app.services.cart_service import CartService
from app.domain.models.order_model import Order, OrderItem
from app.domain.schemas.item_schema import ItemUpdateSchema
class OrderService:
    def __init__(
        self,
        order_repository: Annotated[OrderRepository, Depends()],
        cart_service: Annotated[CartService, Depends()],
        item_service:Annotated[ItemService, Depends()],

    ):
        self.order_repository = order_repository
        self.cart_service = cart_service
        self.item_service = item_service


    async def create_order_from_cart(self, buyer_id: UUID, website_id: UUID) ->Order:
        logger.info(f"Creating order for buyer {buyer_id} on website {website_id}...")
        order = self.order_repository.create_order_from_cart(buyer_id, website_id)
        await self.cart_service.clear_cart(buyer_id)
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
        logger.info(f"Updating order status: {order_id}")
        return self.order_repository.update_order_status(order_id, new_status)

    async def get_pending_order(self, buyer_id: UUID) -> Order:
        logger.info(f"Getting pending order with id buyer: {buyer_id}")
        return self.order_repository.get_pending_order(buyer_id)
    

    async def reduce_stock(self, order_id: UUID):
        logger.info("reducing the stck")
        order_items = await self.order_repository.get_order_items(order_id)
        
        for order_item in order_items:
            item = await self.item_service.get_item_by_id(order_item.item_id)
            if item:
                item.stock -= order_item.quantity
                if item.stock == 0:
                    item.is_available = False
                item_data = ItemUpdateSchema(stock=item.stock, is_available=item.is_available)
                await self.item_service.edit_item(item.item_id, item_data)


    async def get_order_item_by_buyer_and_item(self, buyer_id: UUID, item_id: UUID) -> bool:
        logger.info("Checking if buyer bought the item")
        Order_item = self.order_repository.get_order_item_by_buyer_and_item(buyer_id,item_id)
        return Order_item       
    
    async def get_sales_count(self, item_id:UUID) -> int:
        return self.order_repository.get_sales_count(item_id)