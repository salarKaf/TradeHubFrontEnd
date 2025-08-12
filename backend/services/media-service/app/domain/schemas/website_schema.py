from pydantic import BaseModel, HttpUrl, Field
from uuid import UUID
from typing import Optional, Dict, List
from datetime import datetime


class FAQSchema(BaseModel):
    question: str
    answer: str


class SocialLinksSchema(BaseModel):
    phone:Optional[str]
    telegram: Optional[str]
    instagram: Optional[str]

class PoilicySchema(BaseModel):
    section: str
    subsection: str

class WebsiteCreateSchema(BaseModel):
    business_name: str
    welcome_text: Optional[str] = None
    guide_page: Optional[str] = None
    store_policy: Optional[List[PoilicySchema]]  = None 
    store_slogan: Optional[str] = None
    social_links: Optional[SocialLinksSchema] = None
    faqs: Optional[List[FAQSchema]]  = None 

    class Config:
        from_attributes = True   

class WebsiteUpdateSchema(BaseModel):
    website_id:UUID
    business_name: Optional[str] = None
    guide_page: Optional[str] = None
    store_policy: Optional[List[PoilicySchema]]  = None 
    store_slogan: Optional[str] = None
    welcome_text: Optional[str] = None
    guide_page: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None
    social_links: Optional[SocialLinksSchema] = None
    faqs: Optional[List[FAQSchema]] = None

    class Config:
        from_attributes = True

class WebsiteResponseSchema(BaseModel):
    website_id: Optional[UUID] = None
    business_name: str
    welcome_text: Optional[str] = None
    guide_page: Optional[str] = None
    store_policy: Optional[List[PoilicySchema]]  = None 
    store_slogan: Optional[str] = None
    social_links: Optional[SocialLinksSchema] = None
    faqs: Optional[List[FAQSchema]] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True