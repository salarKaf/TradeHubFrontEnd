import pytest
from uuid import uuid4
from datetime import datetime, timezone
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from app.main import app
from app.api.v1.endpoints import order_routes
from app.services.order_main_service import OrderMainService
from app.domain.schemas.token_schema import BuyerTokenDataSchema
from app.services.auth_services.buyer_auth_service import get_current_buyer

from types import SimpleNamespace

@pytest.mark.asyncio
async def test_create_order():
    buyer_id = uuid4()
    website_id = uuid4()
    order_id = uuid4()

    mock_order = {
        "order_id": str(order_id),
        "buyer_id": str(buyer_id),
        "website_id": str(website_id),
        "total_price": 250.0,
        "status": "Processing",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "order_items": []
    }

    mock_buyer = SimpleNamespace(
        buyer_id=buyer_id,
        name="John",
        email="john@example.com",
        website_id=website_id
    )

    app.dependency_overrides[get_current_buyer] = lambda: mock_buyer

    app.dependency_overrides[OrderMainService] = lambda: AsyncMock(
        create_order=AsyncMock(return_value=mock_order)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(f"/api/v1/order/create_order?website_id={website_id}")

    assert response.status_code == 201
    assert response.json()["status"] == "Processing"

@pytest.mark.asyncio
async def test_get_my_orders():
    buyer_id = uuid4()

    mock_orders = [{
        "order_id": str(uuid4()),
        "buyer_id": str(buyer_id),
        "website_id": str(uuid4()),
        "total_price": 300.0,
        "status": "Pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "order_items": []
    }]

    app.dependency_overrides[order_routes.get_current_buyer] = lambda: BuyerTokenDataSchema(
        buyer_id=buyer_id,
        name="John",
        email="john@example.com"
    )

    app.dependency_overrides[OrderMainService] = lambda: AsyncMock(
        get_my_orders=AsyncMock(return_value=mock_orders)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/order/my_orders")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert response.json()[0]["buyer_id"] == str(buyer_id)
    assert response.json()[0]["status"] == "Pending"