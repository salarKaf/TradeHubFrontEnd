import pytest
from uuid import uuid4
from datetime import datetime, timezone
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock
from app.main import app
from app.api.v1.endpoints import coupon_routes
from app.domain.schemas.token_schema import TokenDataSchema
from app.services.coupon_main_service import CouponMainService
from decimal import Decimal

@pytest.mark.asyncio
async def test_create_coupon():
    website_id = uuid4()
    user_id = uuid4()

    coupon_payload = {
        "website_id": str(website_id),
        "code": "SUMMER20",
        "discount_amount": 20.0,
        "expiration_date": datetime.now(timezone.utc).isoformat(),
        "usage_limit": 50
    }

    mock_coupon_response = {
        "coupon_id": str(uuid4()),
        "website_id": str(website_id),
        "code": "SUMMER20",
        "discount_amount": 20.0,
        "expiration_date": coupon_payload["expiration_date"],
        "usage_limit": 50,
        "times_used": 0,
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    app.dependency_overrides[coupon_routes.get_current_user] = lambda: TokenDataSchema(
        user_id=user_id,
        email="admin@example.com",
        first_name="Admin",
        last_name="User"
    )

    app.dependency_overrides[CouponMainService] = lambda: AsyncMock(
        create_coupon=AsyncMock(return_value=mock_coupon_response)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/coupon/create_coupon", json=coupon_payload)
        print("RESPONSE BODY:", response.text)

    assert response.status_code == 201
    assert response.json()["code"] == "SUMMER20"


@pytest.mark.asyncio
async def test_get_coupons_by_website():
    website_id = uuid4()

    mock_coupons = [{
        "coupon_id": str(uuid4()),
        "website_id": str(website_id),
        "code": "WELCOME10",
        "discount_amount": Decimal("10.0"),
        "expiration_date": datetime.now(timezone.utc).isoformat(),
        "usage_limit": 100,
        "times_used": 10,
        "created_at": datetime.now(timezone.utc).isoformat()
    }]

    app.dependency_overrides[CouponMainService] = lambda: AsyncMock(
        get_coupons_by_website_id=AsyncMock(return_value=mock_coupons)
    )

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get(f"/api/v1/coupon/website/{website_id}/coupons")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert response.json()[0]["code"] == "WELCOME10"
