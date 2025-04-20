from pydantic import BaseModel 
from uuid import UUID
from typing import Optional, Dict, List
from pydantic.networks import HttpUrl
from datetime import datetime


class WebsiteCreateSchema(BaseModel):
    business_name: str
    category_id: Optional[UUID] = None
    welcome_text: Optional[str] = None
    qa_page: Optional[str] = None
    guide_page: Optional[str] = None
    social_links: Optional[List[str]] = []
    class Config:
        orm_mode = True

class WebsiteBase(WebsiteCreateSchema):
    website_url: str
    custom_domain: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None


class WebsiteResponseSchema(BaseModel):
    business_name: str
    category_id: Optional[UUID] = None
    welcome_text: Optional[str] = None
    qa_page: Optional[str] = None
    guide_page: Optional[str] = None
    social_links: Optional[List[str]] = []
    website_url: Optional[str] = None
    custom_domain: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None
    message: str
class WebsiteUpdateSchema(BaseModel):
    business_name: Optional[str] = None
    category_id: Optional[UUID] = None
    website_url: Optional[str] = None
    custom_domain: Optional[str] = None
    logo_url: Optional[str] = None
    banner_image: Optional[str] = None
    welcome_text: Optional[str] = None
    qa_page: Optional[str] = None
    guide_page: Optional[str] = None
    social_links: Optional[Dict[str, HttpUrl]] = None

    class Config:
        orm_mode = True



class WebsiteCategoryCreateSchema(BaseModel):
    website_id: UUID
    name: str

class WebsiteCategoryResponseSchema(BaseModel):
    id: UUID
    website_id: UUID
    name: str
    created_at: datetime

    class Config:
        orm_mode = True
