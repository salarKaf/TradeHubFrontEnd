
import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from uuid import uuid4
from httpx import AsyncClient, ASGITransport
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_current_user():
    return {"user_id": str(uuid4())}

@pytest.mark.asyncio
async def test_create_website(mock_current_user):
    website_data = {
        "business_name": "Test Shop",
        "welcome_text": "Welcome to our store!",
    }

    with patch("app.services.website_main_service.WebsiteMainService.create_website", new=AsyncMock()) as mock_create:
        mock_create.return_value = {
            "website_id": str(uuid4()),
            **website_data,
            "about_us": None,
            "logo_url": None,
            "banner_image": None
        }

        response = client.post(
            "/api/v1/websites/create_website",
            json=website_data,
            headers={"Authorization": f"Bearer test-token"}
        )

        assert response.status_code == 201
        assert response.json()["business_name"] == website_data["business_name"]


@pytest.mark.asyncio
async def test_get_website():

    website_id = uuid4()
    mock_website_data = {
        "website_id": website_id,
        "business_name": "Test Shop",
        "welcome_text": "Welcome!",
        "social_links": {"phone":"00", "telegram":"@ABC", "instagram":"@testshop"},
    }

    with patch(
        "app.services.website_main_service.WebsiteMainService.get_website_by_id",
        new=AsyncMock(return_value=mock_website_data)
    ):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.get(f"/api/v1/websites/get_website/{website_id}")

    assert response.status_code == 200
    assert response.json()["business_name"] == "Test Shop"
    assert response.json()["social_links"]["instagram"] == "@testshop"