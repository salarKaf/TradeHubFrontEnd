import pytest
from uuid import uuid4
from datetime import datetime, timezone
from httpx import AsyncClient
from httpx import ASGITransport
from unittest.mock import AsyncMock
from app.main import app
from app.api.v1.endpoints import cart_routes
from app.domain.schemas.token_schema import BuyerTokenDataSchema
from app.services.cart_main_service import CartMainService
from datetime import timedelta

@pytest.mark.asyncio
async def test_add_item_to_cart():
    buyer_id = uuid4()
    website_id = uuid4()
    item_id = uuid4()

    mock_cart_item = {
    "id": str(uuid4()),
    "cart_item_id": str(uuid4()),
    "website_id": str(website_id),
    "item_id": str(item_id),
    "quantity": 1,
    "added_at": datetime.now(timezone.utc).isoformat(),
    "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat(),
    "price": 100.0,
    "discount_price": 80.0,
    "total_price": 80.0,
    "created_at": datetime.now(timezone.utc).isoformat()
}


    app.dependency_overrides[cart_routes.get_current_buyer] = lambda: BuyerTokenDataSchema(
        buyer_id=buyer_id,
        name="John",
        email="john@example.com"
    )
    app.dependency_overrides[CartMainService] = lambda: AsyncMock(
        add_item=AsyncMock(return_value=mock_cart_item)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/carts/add_item", json={
            "website_id": str(website_id),
            "item_id": str(item_id)
        })

    assert response.status_code == 201
    assert response.json()["item_id"] == str(item_id)


@pytest.mark.asyncio
async def test_get_my_cart():
    buyer_id = uuid4()
    item_id = uuid4()
    website_id = uuid4()

    mock_cart_items = [{
    "id": str(uuid4()),
    "cart_item_id": str(uuid4()),
    "website_id": str(website_id),
    "item_id": str(item_id),
    "quantity": 1,
    "added_at": datetime.now(timezone.utc).isoformat(),
    "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat(),
    "price": 100.0,
    "discount_price": 80.0,
    "total_price": 80.0,
    "created_at": datetime.now(timezone.utc).isoformat()
}]

    app.dependency_overrides[cart_routes.get_current_buyer] = lambda: BuyerTokenDataSchema(
        buyer_id=buyer_id,
        name="John",
        email="john@example.com"
    )
    app.dependency_overrides[CartMainService] = lambda: AsyncMock(
        get_cart_items=AsyncMock(return_value=mock_cart_items)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/carts/my_cart")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
