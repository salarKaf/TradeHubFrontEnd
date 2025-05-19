from app.domain.models.website_model import Item
from sqlalchemy.orm import Session
from loguru import logger
from uuid import UUID
from app.core.postgres_db.database import get_db
from typing import Annotated, Optional
from fastapi import Depends


class ItemRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_item(self, item: Item) -> Item:
      self.db.add(item)
      self.db.commit()
      self.db.refresh(item)
      logger.info(f"✅ Item created with id: {item.item_id}")
      return item
