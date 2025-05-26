from app.infrastructure.repositories.item_repository import ItemRepository
from app.domain.models.website_model import Item
from app.domain.schemas.item_schema import ItemResponseSchema, ItemCreateSchema
from uuid import UUID
from fastapi import HTTPException, Depends
from app.services.base_service import BaseService
from typing import Annotated
from loguru import logger

class ItemService(BaseService):
    def __init__(
        self,
        item_repository: Annotated[ItemRepository, Depends()],
    ) -> None:
        super().__init__()  
        self.item_repository = item_repository

    async def create_item(self, item_data: ItemCreateSchema) -> Item:
      item = Item(
          website_id=item_data.website_id,
          category_id=item_data.category_id,
          subcategory_id=item_data.subcategory_id,
          name=item_data.name,
          description=item_data.description,
          price=item_data.price,
          delivery_url=item_data.delivery_url,
          post_purchase_note=item_data.post_purchase_note,
          stock=item_data.stock
      )

      created_item = self.item_repository.create_item(item=item)
      logger.info(f"Item created successfully with ID: {created_item.item_id}")

      return created_item
    
    async def get_item_by_id(self, item_id: UUID) -> Item:
        logger.info(f"Fetching item with ID: {item_id}")

        try:
            item = self.item_repository.get_item_by_id(item_id)

            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            
            return item

        # except HTTPException as http_exc:
        #     raise http_exc

        except Exception as e:
            logger.error(f"Error fetching item with ID {item_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching item: {str(e)}")

