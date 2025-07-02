
from app.domain.models.review_model import Review
from loguru import logger
from app.infrastructure.repositories.qan_repository import QuestionRepository
from typing import Annotated, List, Optional
from fastapi import HTTPException, Depends
from app.domain.schemas.qan_schema import QuestionCreateSchema
from app.domain.models.qan_model import ItemQuestion
from uuid import UUID

class QuestionService:
    def __init__(self, rquestion_epository: Annotated[QuestionRepository, Depends()]):
        self.rquestion_epository = rquestion_epository

    def create_question(self, buyer_id: UUID, data: QuestionCreateSchema) -> ItemQuestion:
        return self.rquestion_epository.create_question(buyer_id, data)
