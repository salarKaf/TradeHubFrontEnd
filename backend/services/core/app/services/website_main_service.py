from app.infrastructure.repositories.website_repository import WebsiteRepository
from app.services.website_service import WebsiteService
from app.domain.schemas.website_schema import WebsiteResponseSchema, WebsiteCreateSchema, WebsiteCategoryCreateSchema, WebsiteCategoryResponseSchema
from uuid import UUID
from fastapi import HTTPException, Depends
from loguru import logger
from app.services.base_service import BaseService
from typing import Annotated
from fastapi.encoders import jsonable_encoder

class WebsiteMainService(BaseService):
    def __init__(
        self,
        # website_repository: Annotated[WebsiteRepository, Depends()],
        website_service: Annotated[WebsiteService, Depends()],
    ) -> None:
        super().__init__()
        # self.website_repository = website_repository
        self.website_service = website_service

    async def create_website(self, user_id: UUID, website_data: WebsiteCreateSchema) -> WebsiteResponseSchema:
        logger.info(f"Starting to create website for user {user_id} with data: {website_data.dict()}")

        try:
            created_website = await self.website_service.create_website(user_id, website_data)
            
            return WebsiteResponseSchema(
                id=created_website.website_id,
                business_name=created_website.business_name,
                welcome_text=created_website.welcome_text,
                guide_page=created_website.guide_page,
                social_links=jsonable_encoder(created_website.social_links), 
                faqs=jsonable_encoder(created_website.faqs),  
                website_url=created_website.website_url,
                custom_domain=created_website.custom_domain,
                logo_url=created_website.logo_url,
                banner_image=created_website.banner_image,
                created_at=created_website.created_at,
                message="Website fetched successfully ✅"
            )

        except Exception as e:
            logger.error(f"Error occurred while creating website for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website: {str(e)}")


    #TODO cavoid defining repeated categories
    async def create_website_category(self, website_category_data: WebsiteCategoryCreateSchema) -> WebsiteCategoryResponseSchema:
        logger.info(f"Starting to create website category with data: {website_category_data.dict()}")

        try:
            created_website_category = await self.website_service.create_website_category(website_category_data)

            return WebsiteCategoryResponseSchema(
                id=created_website_category.id,
                website_id=created_website_category.website_id,
                name=created_website_category.name,
                created_at=created_website_category.created_at,
                message="website Category Created Successfully ✅"
            )
        except Exception as e:
            logger.error(f"Error occurred while creating website category: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website category: {str(e)}")


    async def get_website_by_id(self, website_id: UUID) -> WebsiteResponseSchema:
        logger.info(f"Starting to fetch website with ID: {website_id}")

        try:
            website = await self.website_service.get_website_by_id(website_id)

            return WebsiteResponseSchema(
                id = website.website_id,
                business_name=website.business_name,
                category_id=website.category_id,
                welcome_text=website.welcome_text,
                guide_page=website.guide_page,
                social_links=jsonable_encoder(website.social_links), 
                faqs=jsonable_encoder(website.faqs),  
                website_url=website.website_url,
                custom_domain=website.custom_domain,
                logo_url=website.logo_url,
                banner_image=website.banner_image,
                message="Website fetched successfully ✅"   
            )

        except Exception as e:
            logger.error(f"Error occurred while fetching website with ID {website_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching website: {str(e)}")