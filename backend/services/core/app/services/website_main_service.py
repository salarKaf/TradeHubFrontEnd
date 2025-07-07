from app.services.website_service import WebsiteService
from app.services.user_service import UserService
from app.domain.schemas.website_schema import (WebsiteResponseSchema, WebsiteCreateSchema, WebsiteCategoryCreateSchema,
WebsiteCategoryResponseSchema, WebsiteSubcategoryCreateSchema,CategoryUpdateSchema,WebsiteUpdateSchema,SubCategoryUpdateSchema,
WebsiteSubcategoryResponseSchema, MessageResponse, AddWebsiteOwnerSchema)
from uuid import UUID
from fastapi import HTTPException, Depends
from loguru import logger
from app.services.base_service import BaseService
from typing import Annotated
from fastapi.encoders import jsonable_encoder
from typing import List
from app.domain.schemas.buyer_schema import BuyerResponseSchema
from app.services.plan_service import PlanService

class WebsiteMainService(BaseService):
    def __init__(
        self,
        website_service: Annotated[WebsiteService, Depends()],
        user_service: Annotated[UserService, Depends()],
        plan_service: Annotated[PlanService, Depends()],
    ) -> None:
        super().__init__()
        self.website_service = website_service
        self.user_service = user_service
        self.plan_service = plan_service


    async def create_website(self, user_id: UUID, website_data: WebsiteCreateSchema) -> WebsiteResponseSchema:
        logger.info(f"Starting to create website for user {user_id} with data: {website_data.dict()}")

        try:
            website = await self.user_service.check_is_owner(user_id)
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
                is_active=created_website_category.is_active,
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
                is_active=cat.is_active,
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
                is_active=created_subcategory.is_active,
                created_at=created_subcategory.created_at,
                message="Website subcategory created successfully ✅"
            )

        except Exception as e:
            logger.error(f"Error occurred while creating website subcategory: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website subcategory: {str(e)}")  
        
    async def delete_website_subcategory(self, subcategory_id: UUID) -> None:
        logger.info(f"Starting to delete website subcategory with ID: {subcategory_id}")

        await self.website_service.delete_subcategory_by_id(subcategory_id)

        logger.info(f"Successfully deleted website subcategory with ID: {subcategory_id}")
        return {"message": "Subcategory deleted successfully"}


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
                created_at=subcat.created_at,
                is_active=subcat.is_active
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
    
    async def edit_website_category(self, category_data: CategoryUpdateSchema) -> dict:
        logger.info(f"Starting to edit website category with ID: {category_data.category_id}")

        updated_category = await self.website_service.update_category_by_id(category_data)

        logger.info(f"Successfully updated website category with ID: {category_data.category_id}")
        return updated_category
    
    async def edit_website_subcategory(self, subcategory_data: SubCategoryUpdateSchema) -> dict:
        logger.info(f"Starting to edit website subcategory with ID: {subcategory_data.subcategory_id}")

        updated_subcategory = await self.website_service.update_subcategory_by_id(subcategory_data)

        logger.info(f"Successfully updated website subcategory with ID: {subcategory_data.subcategory_id}")
        return updated_subcategory
    
    async def update_website(self,updated_data:WebsiteUpdateSchema, user_id:UUID) -> WebsiteResponseSchema:
        logger.info(f"Starting to edit website with ID: {updated_data.website_id}")
        user_website = await self.user_service.get_website_for_user(user_id)
        if user_website.website_id != updated_data.website_id:
            raise HTTPException(status_code=403, detail="You don't own this website")
        

        updated_website = await self.website_service.update_website(updated_data)

        logger.info(f"Successfully updated website with ID: {updated_data.website_id}")
        
        return WebsiteResponseSchema(
                id=updated_website.website_id,
                business_name=updated_website.business_name,
                welcome_text=updated_website.welcome_text,
                guide_page=updated_website.guide_page,
                social_links=jsonable_encoder(updated_website.social_links), 
                faqs=jsonable_encoder(updated_website.faqs),  
                website_url=updated_website.website_url,
                custom_domain=updated_website.custom_domain,
                logo_url=updated_website.logo_url,
                banner_image=updated_website.banner_image,
                created_at=updated_website.created_at,
                message="Website fetched successfully ✅"
            )
    async def get_buyers_by_website_id(self, website_id: UUID) -> List[BuyerResponseSchema]:
        buyers = await self.website_service.get_buyers_by_website_id(website_id)

        return [BuyerResponseSchema(
            name=buyer.name,
            email=buyer.email,
            message="Buyers fetched successfully ✅"
        ) for buyer in buyers]
    

    async def get_buyers_count_by_website_id(self, website_id: UUID) -> int:
        buyers_count = await self.website_service.get_buyers_count_by_website_id(website_id)
        return buyers_count
    

    async def get_active_buyers_count_by_website_id(self, website_id: UUID) -> int:
        active_buyers_count = await self.website_service.get_active_buyers_count_by_website_id(website_id)

        return active_buyers_count
    

    async def get_sales_summary(self, website_id: UUID, mode: str) -> dict:
        return await self.website_service.get_sales_summary(website_id, mode)

    async def get_last_6_months_sales(self, website_id: UUID) -> List[dict]:
        return await self.website_service.get_last_6_months_sales(website_id)
    
    async def get_total_revenue(self, website_id: UUID) -> dict:
        return await self.website_service.get_total_revenue(website_id)

    async def get_total_sales_count(self, website_id: UUID) -> int:
        return await self.website_service.get_total_sales_count(website_id)
    
    async def get_latest_orders(self, website_id: UUID, limit: int) -> list:
        return await self.website_service.get_latest_orders(website_id, limit)

    async def get_best_selling_items(self, website_id: UUID, limit: int) -> list:
        return await self.website_service.get_best_selling_items(website_id, limit)

    async def get_average_order_per_buyer(self, website_id: UUID) -> int:
        return await self.website_service.get_average_order_per_buyer(website_id)
    
    async def get_total_buyers_count(self, website_id: UUID) -> int:
        return await self.website_service.get_total_buyers_count(website_id)

    async def get_latest_announcements(self, website_id: UUID) -> list:
        return await self.website_service.get_latest_announcements(website_id)
    

    async def get_active_plan(self, website_id:UUID):
        return await self.plan_service.get_active_plan_by_website_id(website_id)
