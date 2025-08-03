import pytest
from uuid import uuid4
from httpx import AsyncClient
from datetime import datetime, timezone
from unittest.mock import AsyncMock
from app.main import app
from app.api.v1.endpoints import qan_routes
from app.domain.schemas.token_schema import BuyerTokenDataSchema, TokenDataSchema
from app.domain.schemas.qan_schema import QuestionResponseSchema
from app.services.qan_main_service import QuestionMainService
from fastapi.testclient import TestClient
from fastapi.responses import JSONResponse
from fastapi import status
from fastapi.testclient import TestClient
from httpx import ASGITransport

@pytest.mark.asyncio
async def test_create_question():
    item_id = uuid4()
    website_id = uuid4()
    buyer_id = uuid4()

    mock_question = {
    "question_id": str(uuid4()),
    "item_id": str(item_id),
    "buyer_id": str(buyer_id),
    "website_id": str(website_id),
    "question_text": "Is this product waterproof?",
    "answer_text": None,
    "created_at": datetime.now(timezone.utc).isoformat(),
    "buyer_name": "Jane Doe"  # 👈 این فیلد لازمه!
}


    app.dependency_overrides[qan_routes.get_current_buyer] = lambda: BuyerTokenDataSchema(
      buyer_id=buyer_id,
      name="Jane Doe",
      email="buyer@example.com"
  )

    app.dependency_overrides[QuestionMainService] = lambda: AsyncMock(
        ask_question=AsyncMock(return_value=mock_question)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/question/create_question", json={
            "item_id": str(item_id),
            "website_id": str(website_id),
            "question_text": "Is this product waterproof?"
        })

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["question_text"] == "Is this product waterproof?"


@pytest.mark.asyncio
async def test_answer_question():
    question_id = uuid4()
    user_id = uuid4()

    mock_answered = {
        "question_id": str(question_id),
        "item_id": str(uuid4()),
        "buyer_id": str(uuid4()),
        "buyer_name": "Ali Manager",
        "website_id": str(uuid4()),
        "question_text": "Does this come with a warranty?",
        "answer_text": "Yes, 2 years warranty included.",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    app.dependency_overrides[qan_routes.get_current_user] = lambda: TokenDataSchema(
        user_id=user_id,
        email="owner@example.com",
        first_name="Ali",
        last_name="Manager"
    )
    app.dependency_overrides[QuestionMainService] = lambda: AsyncMock(
        answer_question=AsyncMock(return_value=mock_answered)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.patch(f"/api/v1/question/questions/{question_id}/answer", json={
            "answer_text": "Yes, 2 years warranty included."
        })

    assert response.status_code == 200
    assert response.json()["answer_text"] == "Yes, 2 years warranty included."
