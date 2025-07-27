from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from app.services.slug_smain_service import SlugMainService
from app.domain.schemas.slug_schema import CreateSlugInput
from typing import Annotated

slug_router = APIRouter()



@slug_router.post("/slug")
async def create_slug(data: CreateSlugInput, service: Annotated[SlugMainService, Depends()]):
    await service.create_slug(data.slug, data.website_id)
    return {"slug": data.slug, "website_id": data.website_id}


@slug_router.get("/slug/{slug}")
async def get_slug(slug: str, service: Annotated[SlugMainService, Depends()]):
    website_id = await service.get_website_id(slug)
    return {"website_id": website_id}


@slug_router.get("/get-slug-by/{website_id}")
async def get_slug_by_website_id(website_id: UUID, service: Annotated[SlugMainService, Depends()]):
    return await service.get_slug_by_website_id(website_id)
