from sqlalchemy.orm import Session
from typing import Annotated 
from app.domain.models.buyer_model import CartItem
from app.core.postgres_db.database import get_db
from fastapi import Depends
from uuid import UUID
import datetime
from loguru import logger

class CartRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def add_item(self, website_id: UUID, buyer_id: UUID, item_id: UUID, quantity: int) -> CartItem:
        now = datetime.datetime.utcnow()
        expires_at = now + datetime.timedelta(hours=2)

        cart_item = CartItem(
            website_id=website_id,
            buyer_id=buyer_id,
            item_id=item_id,
            quantity=quantity,
            added_at=now,
            expires_at=expires_at
        )
        self.db.add(cart_item)
        self.db.commit()
        self.db.refresh(cart_item)
        logger.info(f"Added item {item_id} to cart for buyer {buyer_id}")
        return cart_item