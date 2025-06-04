from typing import List
from uuid import UUID
from fastapi import Depends
from app.services.base_service import BaseService
from app.services.order_service import OrderService
from app.services.user_service import UserService
from app.domain.schemas.order_schema import OrderResponseSchema, OrderItemResponseSchema
from app.domain.models.order_model import Order
from loguru import logger
from typing import Annotated

class OrderMainService(BaseService):
    def __init__(self,  
        order_service : Annotated[OrderService, Depends()],
        user_service : Annotated[UserService, Depends()],
        ):
        super().__init__()
        self.order_service = order_service
        self.user_service = user_service

    async def create_order(self, buyer_id: UUID, website_id: UUID) -> OrderResponseSchema:
        
        logger.info(f"Creating order for buyer...")
        order = await self.order_service.create_order_from_cart(buyer_id, website_id)
        
        return OrderResponseSchema.from_orm(order) 



    async def get_my_orders(self, buyer_id: UUID) -> List[OrderResponseSchema]:
        logger.info("Getting orders for buyer...")
        orders: List[Order] = await self.order_service.get_orders_by_buyer(buyer_id)

        return [
            OrderResponseSchema(
                order_id=order.order_id,
                website_id=order.website_id,
                buyer_id=order.buyer_id,
                status=order.status,
                total_price=order.total_price,
                created_at=order.created_at,
                order_items=[
                    OrderItemResponseSchema(
                        order_item_id= item.order_item_id,
                        item_id=item.item_id,
                        quantity=item.quantity,
                        price=item.price,
                    )
                    for item in order.order_items 
                ]
            )
            for order in orders
        ]
    
    async def get_order_by_id(self,order_id: UUID) -> OrderResponseSchema:
        
        logger.info(f"Getting order ...")
        order = await self.order_service.get_order_by_id(order_id)
        
        return OrderResponseSchema.from_orm(order) 
    

    async def get_orders_by_website_id(self,website_id: UUID) -> OrderResponseSchema:
        
        logger.info(f"Getting order ...")
        orders: List[Order] = await self.order_service.get_orders_by_website_id(website_id)

        return [
            OrderResponseSchema(
                order_id=order.order_id,
                website_id=order.website_id,
                buyer_id=order.buyer_id,
                status=order.status,
                total_price=order.total_price,
                created_at=order.created_at,
                order_items=[
                    OrderItemResponseSchema(
                        order_item_id= item.order_item_id,
                        item_id=item.item_id,
                        quantity=item.quantity,
                        price=item.price,
                    )
                    for item in order.order_items 
                ]
            )
            for order in orders
        ]


    async def get_all_orders(self, user_id: UUID) -> List[OrderResponseSchema]:

        website = await self.user_service.get_website_for_user(user_id)
        orders = await self.get_orders_by_website_id(website.website_id)

        return [
            OrderResponseSchema(
                order_id=order.order_id,
                website_id=order.website_id,
                buyer_id=order.buyer_id,
                status=order.status,
                total_price=order.total_price,
                created_at=order.created_at,
                order_items=[
                    OrderItemResponseSchema(
                        order_item_id= item.order_item_id,
                        item_id=item.item_id,
                        quantity=item.quantity,
                        price=item.price,
                    )
                    for item in order.order_items 
                ]
            )
            for order in orders
        ]