from sqlalchemy.orm import Session
from typing import Annotated 
from app.domain.models.buyer_model import CartItem
from app.core.postgres_db.database import get_db
from fastapi import Depends
from uuid import UUID
import datetime
from loguru import logger
from typing import List
class CartRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def add_item(self, website_id: UUID, buyer_id: UUID, item_id: UUID) -> CartItem:
        
      existing_cart_item = self.db.query(CartItem).filter_by(
        website_id=website_id,
        buyer_id=buyer_id,
        item_id=item_id).first()
      
      now = datetime.datetime.utcnow()
      expires_at = now + datetime.timedelta(hours=2)
      if existing_cart_item:
        existing_cart_item.quantity += 1
        existing_cart_item.expires_at = expires_at 
        self.db.commit()
        self.db.refresh(existing_cart_item)
        logger.info(f"Updated quantity of item {item_id} in cart for buyer {buyer_id}")
        return existing_cart_item


      else:

        cart_item = CartItem(
            website_id=website_id,
            buyer_id=buyer_id,
            item_id=item_id,
            quantity=1,
            added_at=now,
            expires_at=expires_at
        )
        self.db.add(cart_item)
        self.db.commit()
        self.db.refresh(cart_item)
        logger.info(f"Added item {item_id} to cart for buyer {buyer_id}")
        return cart_item
      

    def get_cart_items_by_buyer(self, buyer_id: UUID) -> List[CartItem]:
        return self.db.query(CartItem).filter(CartItem.buyer_id == buyer_id).all()   
    

    def delete_expired_items(self, current_time: datetime):
      expired_items = self.db.query(CartItem).filter(CartItem.expires_at <= current_time).all()
      for item in expired_items:
          self.db.delete(item)
      self.db.commit()


  