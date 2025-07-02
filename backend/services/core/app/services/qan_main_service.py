from typing import List
from uuid import UUID
from fastapi import Depends, HTTPException
from app.services.qan_service import QuestionService
from app.domain.schemas.qan_schema import QuestionCreateSchema, QuestionAnswerSchema, QuestionResponseSchema
from loguru import logger
from typing import Annotated


class QuestionMainService:
    def __init__(self, question_service: Annotated[QuestionService, Depends()]):
        self.question_service = question_service

    def ask_question(self, buyer_id: UUID, data: QuestionCreateSchema) -> QuestionResponseSchema:
        logger.info(f"Buyer {buyer_id} is asking question for item {data.item_id}")
        question = self.question_service.create_question(buyer_id, data)
        return QuestionResponseSchema(
            question_id=question.question_id,
            item_id=question.item_id,
            buyer_id=question.buyer_id,
            website_id=question.website_id,
            question_text=question.question_text,
            answer_text=question.answer_text,
            created_at=question.created_at,
            answered_at=question.answered_at,
        )