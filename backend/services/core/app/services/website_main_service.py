from app.services.website_service import WebsiteService
from app.services.user_service import UserService
from app.domain.schemas.website_schema import (WebsiteResponseSchema, WebsiteCreateSchema, WebsiteCategoryCreateSchema,
WebsiteCategoryResponseSchema, WebsiteSubcategoryCreateSchema,
WebsiteSubcategoryResponseSchema, MessageResponse, AddWebsiteOwnerSchema)
from uuid import UUID
from fastapi import HTTPException, Depends
from loguru import logger
from app.services.base_service import BaseService
from typing import Annotated
from fastapi.encoders import jsonable_encoder
from typing import List


class WebsiteMainService(BaseService):
    def __init__(
        self,
        website_service: Annotated[WebsiteService, Depends()],
        user_service: Annotated[UserService, Depends()],
    ) -> None:
        super().__init__()
        self.website_service = website_service
        self.user_service = user_service


    async def create_website(self, user_id: UUID, website_data: WebsiteCreateSchema) -> WebsiteResponseSchema:
        logger.info(f"Starting to create website for user {user_id} with data: {website_data.dict()}")

        try:
            website = self.get_website_for_user(user_id)
            if website:
                raise HTTPException(status_code=409, detail="You only can own one website")

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
        
        except HTTPException as http_exc:
            raise http_exc   

        except Exception as e:
            logger.error(f"Error occurred while creating website for user {user_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website: {str(e)}")


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

        website = await self.website_service.get_website_by_id(website_id)

        return WebsiteResponseSchema(
            id = website.website_id,
            business_name=website.business_name,
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



    async def get_website_categories_by_website_id(self, website_id: UUID) -> List[WebsiteCategoryResponseSchema]:
        logger.info(f"Fetching website categories for website ID: {website_id}")

        categories = await self.website_service.get_website_categories_by_website_id(website_id)

        return [
            WebsiteCategoryResponseSchema(
                id=cat.id,
                website_id=cat.website_id,
                name=cat.name,
                created_at=cat.created_at
            )
            for cat in categories
        ]

    async def delete_website_category(self, category_id: UUID) -> None:
        logger.info(f"Starting to delete website category with ID: {category_id}")

        await self.website_service.delete_category_by_id(category_id)

        logger.info(f"Successfully deleted website category with ID: {category_id}")
        return {"message": "Category deleted successfully"}


    async def create_website_subcategory(self, subcategory_data: WebsiteSubcategoryCreateSchema) -> WebsiteSubcategoryResponseSchema:
        logger.info(f"Starting to create website subcategory with data: {subcategory_data.dict()}")

        try:
            created_subcategory = await self.website_service.create_website_subcategory(subcategory_data)

            return WebsiteSubcategoryResponseSchema(
                id=created_subcategory.id,
                parent_category_id=created_subcategory.parent_category_id,
                name=created_subcategory.name,
                created_at=created_subcategory.created_at,
                message="Website subcategory created successfully ✅"
            )

        except Exception as e:
            logger.error(f"Error occurred while creating website subcategory: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website subcategory: {str(e)}")  


    # async def get_website_by_name(self, website_name: str) -> WebsiteResponseSchema:
    #     logger.info(f"Fetching website by name: {website_name}")

    #     website = await self.website_service.get_website_by_name(website_name)

    #     return WebsiteResponseSchema(
    #         id=website.website_id,
    #         business_name=website.business_name,
    #         welcome_text=website.welcome_text,
    #         guide_page=website.guide_page,
    #         social_links=jsonable_encoder(website.social_links),
    #         faqs=jsonable_encoder(website.faqs),
    #         website_url=website.website_url,
    #         custom_domain=website.custom_domain,
    #         logo_url=website.logo_url,
    #         banner_image=website.banner_image,
    #         created_at=website.created_at,
    #         message="Website fetched successfully ✅"
    #     )


    async def get_subcategories_by_category_id(self, category_id: UUID) -> List[WebsiteSubcategoryResponseSchema]:
        logger.info(f"Fetching subcategories for category ID: {category_id}")
        
        subcategories = await self.website_service.get_subcategories_by_category_id(category_id)
        
        return [
            WebsiteSubcategoryResponseSchema(
                id=subcat.id,
                parent_category_id=subcat.parent_category_id,
                name=subcat.name,
                created_at=subcat.created_at
            ) for subcat in subcategories
        ]
    

    async def get_website_for_user(self, user_id: UUID) -> WebsiteResponseSchema:
        website = await self.user_service.get_website_for_user(user_id)
        return WebsiteResponseSchema(
            id=website.website_id,
            business_name=website.business_name,
            welcome_text=website.welcome_text,
            guide_page=website.guide_page,
            social_links=jsonable_encoder(website.social_links),
            faqs=jsonable_encoder(website.faqs),
            website_url=website.website_url,
            custom_domain=website.custom_domain,
            logo_url=website.logo_url,
            banner_image=website.banner_image,
            created_at=website.created_at,
            message="Website fetched successfully ✅"
        )

    async def add_new_owner(self,owner_id: UUID ,new_owner_data: AddWebsiteOwnerSchema) -> MessageResponse:
        existing_user = await self.user_service.get_user_by_email(new_owner_data.email)
        if not existing_user:
            raise HTTPException(status_code=404, detail="User is not a member of our platform")

        await self.website_service.add_new_owner(owner_id, existing_user.user_id, new_owner_data.website_id)   
        return MessageResponse(message="User successfully added as website owner.")

