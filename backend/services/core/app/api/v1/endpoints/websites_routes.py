from fastapi import APIRouter, Depends, HTTPException, status
from app.services.website_main_service import WebsiteMainService
from app.domain.schemas.website_schema import (WebsiteCreateSchema, WebsiteResponseSchema, WebsiteCategoryCreateSchema, WebsiteCategoryResponseSchema)
from app.services.auth_services.auth_service import get_current_user
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger
from typing import Annotated
from uuid import UUID

website_router = APIRouter()

@website_router.post("/create_website", response_model=WebsiteResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_website(
    website_data: WebsiteCreateSchema, 
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)], 
    website_service: Annotated[WebsiteMainService, Depends()] 
):
    logger.info(f"User with id: {current_user.user_id} is creating a website.")
    
    return await website_service.create_website(current_user.user_id, website_data)

@website_router.post("/create_website_category", response_model=WebsiteCategoryResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_website_category(
    website_category_data: WebsiteCategoryCreateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)], 
    website_service: Annotated[WebsiteMainService, Depends()] 
):
    logger.info(f"Creating a new website category with data: {website_category_data.dict()}")
    created_category = await website_service.create_website_category(website_category_data)
    return created_category


@website_router.get("/get_website/{website_id}", response_model=WebsiteResponseSchema, status_code=status.HTTP_200_OK)
async def get_website(
    website_id: UUID,   
    website_service: Annotated[WebsiteMainService, Depends()]
):
    logger.info(f"Requesting website details with website_id: {website_id}.")
    
    return await website_service.get_website_by_id(website_id)


