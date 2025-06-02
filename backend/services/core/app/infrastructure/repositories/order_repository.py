from typing import Annotated, Dict
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from typing import Optional, List
from  app.core.postgres_db.database import get_db
from uuid import UUID
from  app.domain.models.order_model import Order, CartItem 
from app.infrastructure.repositories.item_repository import ItemRepository
from datetime import datetime

class OrderRepository:
    def __init__(self,
    db: Annotated[Session, Depends(get_db)],
    item_repository: Annotated[ItemRepository, Depends()],):
      self.db = db
      self.item_repository = item_repository
        
    def create_orders_from_cart(self, cart_items: List[CartItem]) -> List[Order]:
        orders = []
        for cart_item in cart_items:
            order = Order(
                website_id=cart_item.website_id,
                buyer_id=cart_item.buyer_id,
                item_id=cart_item.item_id,
                status='Pending',
                total_price=self._calculate_total_price(cart_item),
                created_at=datetime.utcnow()
            )
            self.db.add(order)
            orders.append(order)
        self.db.commit()
        return orders

    def _calculate_total_price(self, cart_item: CartItem) -> float:
        item = self.item_repository.get_item_by_id(cart_item.item_id)
        if item.discount_active and item.discount_expires_at and item.discount_expires_at > datetime.utcnow():
            return float(item.discount_price or item.price) * cart_item.quantity
        else:
            return float(item.price) * cart_item.quantity


