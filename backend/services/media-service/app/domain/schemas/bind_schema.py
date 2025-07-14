from uuid import UUID
from typing import List, Optional
from pydantic import BaseModel

class ItemImageInput(BaseModel):
    url: str
    is_main: Optional[bool] = False

class BindItemImagesSchema(BaseModel):
    item_id: UUID
    images: List[ItemImageInput]


class ItemImageBasicSchema(BaseModel):
    image_id: UUID
    is_main: bool
