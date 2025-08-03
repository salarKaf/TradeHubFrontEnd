from pydantic import BaseModel
from uuid import UUID

class CreateSlugInput(BaseModel):
    website_id: UUID
    slug: str

class UpdateSlug(BaseModel):
    slug: str    