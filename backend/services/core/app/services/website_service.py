from app.infrastructure.repositories.website_repository import WebsiteRepository
from app.domain.models.website_model import Website, WebsiteCategory
from app.domain.schemas.website_schema import WebsiteCreateSchema, WebsiteCategoryCreateSchema, WebsiteResponseSchema
from uuid import UUID
from fastapi import HTTPException, Depends
from app.services.base_service import BaseService
from typing import Annotated
from loguru import logger

class WebsiteService(BaseService):
    def __init__(
        self,
        website_repository: Annotated[WebsiteRepository, Depends()],
    ) -> None:
        super().__init__()  
        self.website_repository = website_repository


    async def create_website(self, user_id: UUID, website_data: WebsiteCreateSchema) -> Website:
        
        created_website = self.website_repository.create_website(website = Website(
            business_name=website_data.business_name,
            category_id=website_data.category_id,
            welcome_text=website_data.welcome_text,
            qa_page=website_data.qa_page,
            guide_page=website_data.guide_page,
            social_links=website_data.social_links,
            
        )
    )
        logger.info(f"Website created successfully with ID: {created_website.website_id}")

        website_owner = self.website_repository.create_website_owner(user_id, created_website.website_id)
        logger.info(f"website owner created with ID: {website_owner.user_id}")
        return created_website

        
    async def create_website_category(self, website_category_data: WebsiteCategoryCreateSchema) -> WebsiteCategory:
        logger.info(f"Starting to create store category with data: {website_category_data.dict()}")

        try:
            new_website_category = self.website_repository.create_website_category(
                website_category=WebsiteCategory(
                    website_id=website_category_data.website_id,
                    name=website_category_data.name,
                )
            )
            return new_website_category
        except Exception as e:
            logger.error(f"Error creating website category: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website category: {str(e)}")

    async def get_website_by_id(self, website_id: UUID) -> Website:
        logger.info(f"Starting to fetch website with ID: {website_id}")

        try:
            website = self.website_repository.get_website_by_id(website_id)

            if not website  :
                logger.warning(f"⚠️ No website found with id: {website_id}")
                raise HTTPException(status_code=404, detail="Website not found")

            return website

        except Exception as e:
            logger.error(f"Error occurred while fetching website with ID {website_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching website: {str(e)}")        