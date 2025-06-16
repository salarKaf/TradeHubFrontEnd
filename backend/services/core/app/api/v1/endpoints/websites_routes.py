from fastapi import APIRouter, Depends, HTTPException, status
from app.services.website_main_service import WebsiteMainService
from app.domain.schemas.website_schema import (WebsiteCreateSchema, WebsiteResponseSchema, WebsiteCategoryCreateSchema,
WebsiteCategoryResponseSchema, WebsiteCategoryResponseSchema,CategoryUpdateSchema,SubCategoryUpdateSchema,
WebsiteSubcategoryResponseSchema, WebsiteSubcategoryCreateSchema,WebsiteUpdateSchema ,AddWebsiteOwnerSchema)
from app.domain.schemas.buyer_schema import BuyerResponseSchema
from app.services.auth_services.auth_service import get_current_user
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger
from typing import Annotated, List
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

@website_router.get("/my_website", response_model=WebsiteResponseSchema)
async def get_my_website(
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_main_service: Annotated[WebsiteMainService, Depends()]
):
    return await website_main_service.get_website_for_user(current_user.user_id)

@website_router.get("/get_website/{website_id}", response_model=WebsiteResponseSchema, status_code=status.HTTP_200_OK)
async def get_website(
    website_id: UUID,   
    website_service: Annotated[WebsiteMainService, Depends()]
):
    logger.info(f"Requesting website details with website_id: {website_id}.")
    
    return await website_service.get_website_by_id(website_id)

# @website_router.get("/get_website_by_name/{website_name}", response_model=WebsiteResponseSchema, status_code=status.HTTP_200_OK)
# async def get_website_by_name(
#     website_name: str,
#     website_service: Annotated[WebsiteMainService, Depends()]
# ):
#     logger.info(f"Requesting website details with website_name: {website_name}.")
    
#     return await website_service.get_website_by_name(website_name)


@website_router.post("/create_website_category", response_model=WebsiteCategoryResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_website_category(
    website_category_data: WebsiteCategoryCreateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)], 
    website_service: Annotated[WebsiteMainService, Depends()] 
):
    logger.info(f"Creating a new website category with data: {website_category_data.dict()}")
    created_category = await website_service.create_website_category(website_category_data)
    return created_category

@website_router.put("/edit_website_category/{category_id}", status_code=status.HTTP_200_OK)
async def edit_website_category(
    category_data: CategoryUpdateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_service: Annotated[WebsiteMainService, Depends()]
):
    logger.info(f"Editing website category with ID: {category_data.category_id}")

    updated_category = await website_service.edit_website_category(category_data)

    return {"detail": "Category updated successfully", "category": updated_category}

@website_router.get("/get_website_categories/{website_id}", response_model=List[WebsiteCategoryResponseSchema], status_code=status.HTTP_200_OK)
async def get_website_categories(
    website_id: UUID,
    website_service: Annotated[WebsiteMainService, Depends()] 
):
    logger.info(f"Requesting website categories for website id: {website_id}")
    categories = await website_service.get_website_categories_by_website_id(website_id)
    return categories


@website_router.delete("/delete_website_category/{category_id}", status_code=status.HTTP_200_OK)
async def delete_website_category(
    category_id: UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)], 
    website_service: Annotated[WebsiteMainService, Depends()] 
):
    logger.info(f"Deleting website category with ID: {category_id}")
    
    await website_service.delete_website_category(category_id)
    
    return {"detail": "Category deleted successfully"}


@website_router.post("/create_website_subcategory", response_model=WebsiteSubcategoryResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_website_subcategory(
    subcategory_data: WebsiteSubcategoryCreateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_service: Annotated[WebsiteMainService, Depends()]
):
    logger.info(f"User {current_user.user_id} is creating a website subcategory with data: {subcategory_data.dict()}")
    created_subcategory = await website_service.create_website_subcategory(subcategory_data)
    return created_subcategory


@website_router.get("/get_subcategories_by_category_id/{category_id}", response_model=List[WebsiteSubcategoryResponseSchema], status_code=status.HTTP_200_OK)
async def get_subcategories_by_category_id(
    category_id: UUID,
    website_service: Annotated[WebsiteMainService, Depends()],
):
    logger.info(f"Requesting subcategories for category_id: {category_id}.")
    
    return await website_service.get_subcategories_by_category_id(category_id)

@website_router.put("/edit_website_subcategory/{subcategory_id}", status_code=status.HTTP_200_OK)
async def edit_website_subcategory(
    subcategory_data: SubCategoryUpdateSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_service: Annotated[WebsiteMainService, Depends()]
):
    logger.info(f"Editing website category with ID: {subcategory_data.subcategory_id}")

    updated_subcategory = await website_service.edit_website_subcategory(subcategory_data)

    return {"detail": "subcategory updated successfully", "ُSubcategory": updated_subcategory}

@website_router.delete("/delete_website_subcategory/{subcategory_id}", status_code=status.HTTP_200_OK)
async def delete_website_subcategory(
    subcategory_id: UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)], 
    website_service: Annotated[WebsiteMainService, Depends()] 
):
    logger.info(f"Deleting website subcategory with ID: {subcategory_id}")
    
    await website_service.delete_website_subcategory(subcategory_id)
    
    return {"detail": "Subcategory deleted successfully"}



@website_router.post("/add_owner/{website_id}", status_code=201)
async def add_website_owner(
    owner_data: AddWebsiteOwnerSchema,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_main_service: Annotated[WebsiteMainService, Depends()]
):
    return await website_main_service.add_new_owner(current_user.user_id, owner_data)


@website_router.put("/website/{website_id}", status_code=200)
async def edit_website(
    updated_data: WebsiteUpdateSchema,  
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],   
    website_service:Annotated[WebsiteMainService, Depends()]
):

    return await website_service.update_website(updated_data, current_user.user_id)

@website_router.get("/buyers/{website_id}", response_model=List[BuyerResponseSchema], status_code=status.HTTP_200_OK)
async def get_buyers_by_website_id(
    website_id: UUID,   
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_service: Annotated[WebsiteMainService, Depends()],
):
    buyers = await website_service.get_buyers_by_website_id(website_id)
    return buyers



@website_router.get("/buyers/count/{website_id}", status_code=status.HTTP_200_OK)
async def get_buyers_count_by_website_id(
    website_id: UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_service: Annotated[WebsiteMainService, Depends()],
):

    buyers_count = await website_service.get_buyers_count_by_website_id(website_id)
    return {"buyers_count": buyers_count}


@website_router.get("/buyers/active/count/{website_id}", status_code=status.HTTP_200_OK)
async def get_active_buyers_count(
    website_id: UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    website_service: Annotated[WebsiteMainService, Depends()],
):
   
    active_buyers_count = await website_service.get_active_buyers_count_by_website_id(website_id)
    return {"website_id": website_id, "active_buyers_count": active_buyers_count}