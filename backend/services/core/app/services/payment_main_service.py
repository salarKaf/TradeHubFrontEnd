from app.services.payment_service import PaymentService
from app.services.order_service import OrderService
from loguru import logger
from fastapi import  Depends, HTTPException
from typing import Annotated
from uuid import UUID

class PaymentMainService:
    def __init__(self, payment_service: Annotated[PaymentService, Depends()],
        order_service: Annotated[OrderService, Depends()]):
        self.payment_service = payment_service 
        self.order_service = order_service 

    async def initiate_payment(self, buyer_id: UUID) -> str:
        logger.info(f"Initiating payment for buyer: {buyer_id}")
        order = await self.order_service.get_pending_order(buyer_id)
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        
        payment_url = await self.payment_service.request_payment(order.order_id, amount = order.total_price)
        return payment_url

    async def confirm_payment(self, order_id: UUID, authority: str, status: str) -> bool:
        order = await self.order_service.get_order_by_id(order_id)
        if status != "OK":
            await self.order_service.update_order_status(order_id, "Canceled")
            return "Canceled"

        is_successful = await self.payment_service.verify_payment(
            amount=float(order.total_price),  
            authority=authority 
        )

        if is_successful:
            await self.order_service.update_order_status(order_id, "Paid")
            return "success"
        else:
            await self.order_service.update_order_status(order_id, "Canceled")
            return "failed"