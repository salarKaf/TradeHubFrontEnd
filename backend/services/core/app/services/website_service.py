from app.infrastructure.repositories.website_repository import WebsiteRepository, WebsiteSubcategory, WebsiteOwner
from app.domain.models.website_model import Website, WebsiteCategory
from app.domain.schemas.website_schema import WebsiteCreateSchema, WebsiteCategoryCreateSchema, WebsiteResponseSchema, WebsiteSubcategoryCreateSchema
from uuid import UUID
from fastapi import HTTPException, Depends
from app.services.base_service import BaseService
from typing import Annotated
from loguru import logger
from fastapi.encoders import jsonable_encoder
from typing import List

class WebsiteService(BaseService):
    def __init__(
        self,
        website_repository: Annotated[WebsiteRepository, Depends()],
    ) -> None:
        super().__init__()  
        self.website_repository = website_repository


    async def create_website(self, user_id: UUID, website_data: WebsiteCreateSchema) -> Website:
        
        created_website = self.website_repository.create_website(website=Website(
            business_name=website_data.business_name,
            category_id=website_data.category_id,
            welcome_text=website_data.welcome_text,
            guide_page=website_data.guide_page,
            social_links=jsonable_encoder(website_data.social_links),  
            faqs=jsonable_encoder(website_data.faqs), 

        ))
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


    async def get_website_categories_by_website_id(self, website_id: UUID) -> List[WebsiteCategory]:
        logger.info(f"Fetching categories for website ID: {website_id}")

        try:
            categories = self.website_repository.get_website_categories_by_website_id(website_id)

            if not categories:
                raise HTTPException(status_code=404, detail="No categories found for this website")
            
            return categories

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            logger.error(f"Error fetching categories for website ID {website_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching categories: {str(e)}")        

    async def delete_category_by_id(self, category_id: UUID) -> None:
        logger.info(f"Attempting to delete category with ID: {category_id}")
        
        try:
            category = self.website_repository.get_category_by_id(category_id)
            
            if not category:
                raise HTTPException(status_code=404, detail="Category not found")

            self.website_repository.delete_category(category_id)
            logger.info(f"Category with ID {category_id} successfully deleted.")

        except HTTPException as http_exc:
            raise http_exc

        except Exception as e:
            logger.error(f"Error deleting category with ID {category_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error deleting category: {str(e)}")

    async def get_website_by_id(self, website_id: UUID) -> Website:
        logger.info(f"Starting to fetch website with ID: {website_id}")

        try:
            website = self.website_repository.get_website_by_id(website_id)

            if not website  :
                logger.warning(f"⚠️ No website found with id: {website_id}")
                raise HTTPException(status_code=404, detail="Website not found")

            return website

        # except HTTPException as http_exc:
        #     raise http_exc    

        except Exception as e:
            logger.error(f"Error occurred while fetching website with ID {website_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error fetching website: {str(e)}")        

    async def create_website_subcategory(self, subcategory_data: WebsiteSubcategoryCreateSchema) -> WebsiteSubcategory:
        logger.info(f"Starting to create website subcategory with data: {subcategory_data.dict()}")

        try:
            new_subcategory = self.website_repository.create_website_subcategory(
                subcategory=WebsiteSubcategory(
                    parent_category_id=subcategory_data.parent_category_id,
                    name=subcategory_data.name
                )
            )
            return new_subcategory

        except Exception as e:
            logger.error(f"Error creating website subcategory: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Error creating website subcategory: {str(e)}")   


    # async def get_website_by_name(self, website_name: str) -> Website:
    #     website = self.website_repository.get_website_by_name(website_name)
        
    #     if not website:
    #         raise HTTPException(status_code=404, detail="Website not found")
        
    #     return website


    async def get_subcategories_by_category_id(self, category_id: UUID) -> List[WebsiteSubcategory]:
        logger.info(f"Fetching subcategories for category ID: {category_id}")
        
        subcategories = self.website_repository.get_subcategories_by_category_id(category_id)
        
        if not subcategories:
            raise HTTPException(status_code=404, detail="No subcategories found for this category")
        
        return subcategories
    

    async def add_new_owner(self,owner_id: UUID ,user_id: UUID, website_id: UUID) -> WebsiteOwner:
        website_owner = self.website_repository.get_owner_by_user_and_website(owner_id, website_id)
        if not website_owner:
            raise HTTPException(status_code=403, detail="You are not the owner of this website and cannot add owners.")

        existing_owner = self.website_repository.get_owner(user_id)
        if existing_owner:
            raise HTTPException(status_code=409, detail="User already owns a website.")
        new_owner = self.website_repository.create_website_owner(user_id, website_id)
        return new_owner
