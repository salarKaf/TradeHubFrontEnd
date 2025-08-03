import pytest
from uuid import uuid4
from unittest.mock import AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.admin_main_service import AdminMainService
from app.domain.schemas.token_schema import AdminTokenDataSchema
from app.services.auth_services.admin_auth_service import get_current_admin

from app.domain.schemas.admin_schema import ShopPlanStatsSchema

@pytest.mark.asyncio
async def test_get_dashboard_stats():
    fake_stats = {
        "free": 5,
        "starter": 10,
        "pro": 3,
        "enterprise": 1,
        "total_active": 19,
        "basic_active": 15,
        "pro_active": 4
    }

    mock_admin = AdminTokenDataSchema(
        admin_id=uuid4(),
        email="admin@example.com",
        first_name="Admin",
        last_name="User"
    )

    expected_response = ShopPlanStatsSchema(**fake_stats).model_dump()

    app.dependency_overrides[AdminMainService] = lambda: AsyncMock(
        get_shop_plan_stats=AsyncMock(return_value=expected_response)
    )
    app.dependency_overrides[get_current_admin] = lambda: mock_admin

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.get("/api/v1/admin/dashboard/stats")

    assert response.status_code == 200
    assert response.json() == expected_response
