from app.domain.schemas.review_schema import  ReviewResponseSchema
from app.services.slug_service import SlugService
from fastapi import HTTPException, Depends
from typing import Annotated, Optional
from uuid import UUID

class SlugMainService:
    def __init__(self, slug_service: Annotated[SlugService, Depends()]):
        self.slug_service = slug_service

    async def create_slug(self, slug: str, website_id: UUID) -> bool:
        exist_slug = await self.slug_service.get_slug(slug)
        if exist_slug:
            raise HTTPException(status_code=403, detail="Slug already exists.")
        return await self.slug_service.create_slug(slug, website_id)

    async def get_website_id(self, slug: str) -> Optional[int]:
        slug = await self.slug_service.get_slug(slug)
        if not slug: 
            raise HTTPException(status_code=404, detail="Slug Not Found.")
        return slug.website_id

    async def get_slug_by_website_id(self, website_id: UUID) -> Optional[str]:
        slug = await self.slug_service.get_slug_by_website_id(website_id)
        return slug.slug
