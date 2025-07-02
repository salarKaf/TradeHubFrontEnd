from fastapi import APIRouter, Depends, status
from typing import Annotated, List
from app.domain.schemas.qan_schema import QuestionCreateSchema, QuestionResponseSchema, QuestionAnswerSchema
from app.services.auth_services.auth_service import get_current_buyer
from app.domain.schemas.token_schema import TokenDataSchema
from app.services.qan_main_service import QuestionMainService
from uuid import UUID
from loguru import logger


qan_router = APIRouter()

@qan_router.post("/create_question", response_model=QuestionResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_question(
    question: QuestionCreateSchema,
    current_buyer: Annotated[TokenDataSchema, Depends(get_current_buyer)],
    question_service: Annotated[QuestionMainService, Depends()]
):
    logger.info(f"Buyer {current_buyer.buyer_id} is asking question for item {question.item_id}")
    return question_service.ask_question(
        buyer_id=current_buyer.buyer_id,
        data=question
    )
