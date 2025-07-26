from pydantic import BaseModel
from uuid import UUID

class FavoriteResponseSchema(BaseModel):
    id: UUID
    item_id: UUID

    class Config:
      from_attributes = True