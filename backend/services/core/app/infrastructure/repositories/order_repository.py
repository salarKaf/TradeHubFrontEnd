from typing import Annotated, Dict
from loguru import logger
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from  app.core.postgres_db.database import get_db
from uuid import UUID
from  app.domain.models.order_model import Order, OrderItem
from app.infrastructure.repositories.item_repository import ItemRepository
from app.infrastructure.repositories.cart_repository import CartRepository
from datetime import datetime

class OrderRepository:
    def __init__(self,
    db: Annotated[Session, Depends(get_db)],
    item_repository: Annotated[ItemRepository, Depends()],
    cart_repository: Annotated[CartRepository, Depends()],
    ):
      self.db = db
      self.item_repository = item_repository
      self.cart_repository = cart_repository

        
    def create_order_from_cart(self, buyer_id: UUID, website_id: UUID) -> Order:
        cart_items = self.cart_repository.get_cart_items_by_buyer(buyer_id)
        if not cart_items:
            raise HTTPException(status_code=404, detail="Cart is empty for this website.")

        total_price = 0
        for cart_item in cart_items:
            item = self.item_repository.get_item_by_id(cart_item.item_id)
            price = item.discount_price if (item.discount_active and item.discount_expires_at and item.discount_expires_at > datetime.utcnow()) else item.price
            total_price += float(price) * cart_item.quantity

        order = Order(
            website_id=website_id,
            buyer_id=buyer_id,
            status='Pending',
            total_price=total_price,
            created_at=datetime.utcnow()
        )
        self.db.add(order)
        self.db.flush()  

        for cart_item in cart_items:
            item = self.item_repository.get_item_by_id(cart_item.item_id)
            price = item.discount_price if (item.discount_active and item.discount_expires_at and item.discount_expires_at > datetime.utcnow()) else item.price

            order_item = OrderItem(
                order_id=order.order_id,
                item_id=cart_item.item_id,
                quantity=cart_item.quantity,
                price=price * cart_item.quantity
            )
            self.db.add(order_item)

        self.db.commit()
        return order


    def get_orders_by_buyer(self, buyer_id: UUID) -> List[Order]:
     return self.db.query(Order).filter(Order.buyer_id == buyer_id).all()
    

    def get_order_by_id(self, order_id: UUID) -> Order:
     return self.db.query(Order).filter(Order.order_id == order_id).first()

    def get_orders_by_website_id(self, website_id:UUID)-> List[Order]:
        return self.db.query(Order).filter(Order.website_id == website_id).all()
    

    def update_order_status(self, order_id: UUID, new_status: str) -> None:
        order = self.get_order_by_id(order_id)
        
        if order:
            order.status = new_status
            self.db.commit()
            self.db.refresh(order)  
        else:
            raise Exception(f"Order with ID {order_id} not found.")
        


    def get_pending_order(self, buyer_id: UUID) -> List[Order]:
        return self.db.query(Order).filter(Order.buyer_id == buyer_id, Order.status == "Pending").first()    