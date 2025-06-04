from app.infrastructure.repositories.item_repository import ItemRepository
from app.services.plan_service import PlanService
from app.domain.models.website_model import Item
from app.domain.schemas.item_schema import ItemResponseSchema, ItemCreateSchema,ItemUpdateSchema
from uuid import UUID
from fastapi import HTTPException, Depends
from app.services.base_service import BaseService
from typing import Annotated, List
from loguru import logger

class ItemService(BaseService):
    def __init__(
        self,
        item_repository: Annotated[ItemRepository, Depends()],
        plan_service: Annotated[PlanService, Depends()],
    ) -> None:
        super().__init__()  
        self.item_repository = item_repository
        self.plan_service =plan_service

    async def create_item(self, item_data: ItemCreateSchema) -> Item:
      
      await self.plan_service.check_item_limit(item_data.website_id)

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

    async def get_items_by_subcategory_id(self, subcategory_id: UUID) -> List[Item]:
        try:
            items = self.item_repository.get_items_by_subcategory_id(subcategory_id)
            if not items:
                raise HTTPException(status_code=404, detail="No items found for this subcategory")
            return items
        # except HTTPException as http_exc:
        #     raise http_exc
        except Exception as e:
            logger.error(f"Error fetching items for subcategory {subcategory_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Error fetching items")
        

    async def get_items_by_category_id(self, category_id: UUID) -> List[Item]:
        try:
            items = self.item_repository.get_items_by_category_id(category_id)
            if not items:
                raise HTTPException(status_code=404, detail="No items found for this subcategory")
            return items

        except Exception as e:
            logger.error(f"Error fetching items for category {category_id}: {str(e)}")
            raise HTTPException(status_code=500, detail="Error fetching items")   
        
    async def edit_item(self, item_id: UUID, item_data: ItemUpdateSchema) -> Item:
        logger.info(f"Updating item with ID: {item_id}")
        item = self.item_repository.get_item_by_id(item_id)
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        update_data = item_data.dict(exclude_unset=True)  
    
        for key, value in update_data.items():
            setattr(item, key, value)
        
        updated_item = self.item_repository.update_item(item)
        
        return updated_item    
    

    async def delete_item(self, item_id: UUID) -> bool:
        logger.info(f"Deleting item with ID: {item_id}")

        item = self.item_repository.get_item_by_id(item_id)
        
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        self.item_repository.delete_item(item)
        
        return True
    

    async def get_newest_items(self, website_id: UUID, limit: int) -> List[Item]:
        logger.info(f"Fetching the first {limit} newest items")

        items = self.item_repository.get_newest_items(website_id, limit)
        return items