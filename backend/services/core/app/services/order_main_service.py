from typing import List
from uuid import UUID
from fastapi import Depends
from app.services.base_service import BaseService
from app.services.order_service import OrderService
from app.domain.schemas.order_schema import OrderResponseSchema
from app.domain.models.order_model import Order
from loguru import logger
from typing import Annotated

class OrderMainService(BaseService):
    def __init__(self,  
        order_service : Annotated[OrderService, Depends()]):
        super().__init__()
        self.order_service = order_service

    async def create_order(self, buyer_id: UUID, website_id: UUID) -> List[OrderResponseSchema]:
        
        logger.info(f"Main service: Creating order for buyer {buyer_id} on website {website_id}")
        orders: List[Order] = await self.order_service.create_order_from_cart(buyer_id, website_id)
        
        return [
            OrderResponseSchema(
                order_id=order.order_id,
                website_id=order.website_id,
                item_id=order.item_id,
                buyer_id=order.buyer_id,
                total_price=order.total_price,
                status=order.status,
                created_at=order.created_at
            )
            for order in orders
        ]
