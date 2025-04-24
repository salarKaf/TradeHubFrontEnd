from app.domain.models.website_model import Website, WebsiteOwner, WebsiteCategory
from sqlalchemy.orm import Session
from loguru import logger
from uuid import UUID
from app.core.postgres_db.database import get_db
from typing import Annotated
from fastapi import Depends

class WebsiteRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db
        
    def create_website(self, website: Website) -> Website:

        self.db.add(website)
        self.db.commit()
        self.db.refresh(website)
        logger.info(f"✅ Website created with id: {website.website_id}")
        return website

    def create_website_owner(self, user_id: UUID, website_id: UUID) -> WebsiteOwner:
        website_owner = WebsiteOwner(user_id=user_id, website_id=website_id)
        self.db.add(website_owner)
        self.db.commit()
        self.db.refresh(website_owner)
        logger.info(f"✅ website owner with user_id {user_id} associated with website {website_id}")
        return website_owner

    def create_website_category(self, website_category: WebsiteCategory) -> WebsiteCategory:
        self.db.add(website_category)
        self.db.commit()
        self.db.refresh(website_category)
        logger.info(f"✅ website category '{website_category.name}' created with id: {website_category.id}")
        return website_category    


    def get_website_by_id(self, website_id: UUID) -> Website:
        website = self.db.query(Website).filter(Website.website_id == website_id).first()

        if not website :
            logger.warning(f"⚠️ No website found with id: {website_id}")
        else:
            logger.info(f"✅ Website found with id: {website_id}")

        return website   