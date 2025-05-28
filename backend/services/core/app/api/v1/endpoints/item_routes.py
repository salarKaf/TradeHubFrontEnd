from fastapi import APIRouter, Depends, HTTPException, status
from app.services.item_main_service import ItemMainService
from app.domain.schemas.item_schema import ItemCreateSchema,ItemResponseSchema 
from app.services.auth_services.auth_service import get_current_user
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger
from typing import Annotated, List
from uuid import UUID

item_router = APIRouter()

@item_router.post("/create_item", response_model=ItemResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_item(
    item_data: ItemCreateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    item_service: Annotated[ItemMainService, Depends()]
):
    logger.info(f"User with id: {current_user.user_id} is creating an item with data: {item_data.dict()}")

    created_item = await item_service.create_item(item_data)
    return created_item


@item_router.get("/items/{item_id}", response_model=ItemResponseSchema, status_code=status.HTTP_200_OK)
async def get_item_by_id(
    item_id: UUID,
    item_main_service: Annotated[ItemMainService, Depends()]
):
    logger.info(f"Fetching item with ID: {item_id}")
    item_response = await item_main_service.get_item_by_id(item_id)
    return item_response


@item_router.get("/items/by_category/{category_id}", response_model=List[ItemResponseSchema], status_code=status.HTTP_200_OK)
async def get_items_by_subcategory(
    category_id: UUID,
    item_main_service: Annotated[ItemMainService, Depends()]
):
    return await item_main_service.get_items_by_category_id(category_id)

@item_router.get("/items/by_subcategory/{subcategory_id}", response_model=List[ItemResponseSchema], status_code=status.HTTP_200_OK)
async def get_items_by_subcategory(
    subcategory_id: UUID,
    item_main_service: Annotated[ItemMainService, Depends()]
):
    return await item_main_service.get_items_by_subcategory_id(subcategory_id)