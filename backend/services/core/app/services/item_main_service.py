from app.infrastructure.repositories.item_repository import ItemRepository
from app.services.item_service import ItemService
from app.domain.schemas.item_schema import ItemCreateSchema, ItemResponseSchema
from uuid import UUID
from fastapi import HTTPException, Depends
from loguru import logger
from app.services.base_service import BaseService
from typing import Annotated

class ItemMainService(BaseService):
    def __init__(
        self,
        item_service: Annotated[ItemService, Depends()],
    ) -> None:
        super().__init__()
        self.item_service = item_service


    async def create_item(self, item_data: ItemCreateSchema) -> ItemResponseSchema:
        logger.info(f"Starting to create item with data: {item_data.dict()}")

        try:
            created_item = await self.item_service.create_item(item_data)

            return ItemResponseSchema(
                item_id=created_item.item_id,
                website_id=created_item.website_id,
                category_id=created_item.category_id,
                subcategory_id=created_item.subcategory_id,
                name=created_item.name,
                description=created_item.description,
                price=created_item.price,
                discount_price=created_item.discount_price,
                discount_active=created_item.discount_active,
                discount_expires_at=created_item.discount_expires_at,
                delivery_url=created_item.delivery_url,
                post_purchase_note=created_item.post_purchase_note,
                stock=created_item.stock,
                image_url=created_item.image_url,
                created_at=created_item.created_at,
            )

        except Exception as e:
            logger.error(f"Error occurred while creating item: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating item: {str(e)}")             
        

        
    async def get_item_by_id(self, item_id: UUID) -> ItemResponseSchema:
        logger.info(f"Starting to fetch item with ID: {item_id}")

        item = await self.item_service.get_item_by_id(item_id)

        return ItemResponseSchema(
            item_id=item.item_id,
            website_id=item.website_id,
            category_id=item.category_id,
            subcategory_id=item.subcategory_id,
            name=item.name,
            description=item.description,
            price=item.price,
            discount_price=item.discount_price,
            discount_active=item.discount_active,
            discount_expires_at=item.discount_expires_at,
            delivery_url=item.delivery_url,
            post_purchase_note=item.post_purchase_note,
            stock=item.stock,
            image_url=item.image_url,
            created_at=item.created_at,
        )
