from pydantic import BaseModel, HttpUrl, Field
from uuid import UUID
from typing import Optional, Dict, List
from datetime import datetime


class FAQSchema(BaseModel):
    question: str
    answer: str


class SocialLinksSchema(BaseModel):
    telegram: Optional[HttpUrl]
    instagram: Optional[HttpUrl]

class WebsiteCreateSchema(BaseModel):
    business_name: str
    category_id: Optional[UUID] = None
    welcome_text: Optional[str] = None
    guide_page: Optional[str] = None
    social_links: Optional[ SocialLinksSchema] = None
    faqs: Optional[List[FAQSchema]]  

    class Config:
        from_attributes = True   

class WebsiteUpdateSchema(BaseModel):
    business_name: Optional[str] = None
    category_id: Optional[UUID] = None
    website_url: Optional[str] = None
    custom_domain: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None
    welcome_text: Optional[str] = None
    guide_page: Optional[str] = None
    social_links: Optional[SocialLinksSchema] = None
    faqs: Optional[List[FAQSchema]] = None

    class Config:
        from_attributes = True

class WebsiteResponseSchema(BaseModel):
    id: Optional[UUID] = None
    business_name: str
    category_id: Optional[UUID] = None
    welcome_text: Optional[str] = None
    guide_page: Optional[str] = None
    social_links: Optional[SocialLinksSchema] = None
    faqs: Optional[List[FAQSchema]] = None
    website_url: Optional[str] = None
    custom_domain: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None
    created_at: Optional[datetime] = None
    message: Optional[str] = None

    class Config:
        from_attributes = True


class WebsiteCategoryCreateSchema(BaseModel):
    website_id: UUID
    name: str

class WebsiteCategoryResponseSchema(BaseModel):
    id: UUID
    website_id: UUID
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
