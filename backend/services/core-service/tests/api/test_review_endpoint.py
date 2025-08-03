import pytest
from httpx import AsyncClient
from uuid import uuid4
from datetime import datetime, timezone
from unittest.mock import AsyncMock, patch
from app.main import app
from app.domain.schemas.token_schema import BuyerTokenDataSchema
from httpx import AsyncClient, ASGITransport
from app.services.review_main_service import ReviewMainService
from fastapi.testclient import TestClient
from app.api.v1.endpoints import review_routes


@pytest.mark.asyncio
async def test_create_review():
    fake_buyer_id = uuid4()
    fake_website_id = uuid4()
    fake_item_id = uuid4()

    review_data = {
        "website_id": str(fake_website_id),
        "item_id": str(fake_item_id),
        "rating": 5,
        "text": "Great product!"
    }

    mock_created_review = {
        "review_id": str(uuid4()),
        "website_id": str(fake_website_id),
        "item_id": str(fake_item_id),
        "buyer_id": str(fake_buyer_id),
        "buyer_name": "Test Buyer",
        "rating": 5,
        "text": "Great product!",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    app.dependency_overrides[review_routes.get_current_buyer] = lambda: BuyerTokenDataSchema(
        buyer_id=fake_buyer_id,
        name="Buyer",
        email="test@buyer.com"
    )

    app.dependency_overrides[ReviewMainService] = lambda: AsyncMock(
        create_review=AsyncMock(return_value=mock_created_review)
    )

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/review/create_review",
            json=review_data,
            headers={"Authorization": "Bearer test-token"}
        )


    assert response.status_code == 201
    assert response.json()["rating"] == 5
    app.dependency_overrides = {}


@pytest.mark.asyncio
async def test_get_review_by_id():
    review_id = uuid4()
    buyer_id = uuid4()
    website_id = uuid4()
    item_id = uuid4()

    mock_review_data = {
        "review_id": str(review_id),
        "website_id": str(website_id),
        "item_id": str(item_id),
        "buyer_id": str(buyer_id),
        "buyer_name": "Test Buyer",
        "rating": 4,
        "text": "Nice item.",
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    # override dependency
    app.dependency_overrides[review_routes.ReviewMainService] = lambda: AsyncMock(
        get_review_by_id=AsyncMock(return_value=mock_review_data)
    )

    # use ASGITransport instead of app=
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/v1/review/reviews/{review_id}")

    assert response.status_code == 200
    assert response.json()["review_id"] == str(review_id)
    assert response.json()["text"] == "Nice item."