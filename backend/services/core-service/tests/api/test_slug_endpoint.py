import pytest
from uuid import uuid4
from httpx import AsyncClient
from httpx import ASGITransport
from unittest.mock import AsyncMock
from app.main import app
from app.api.v1.endpoints import slug_routes
from app.services.slug_smain_service import SlugMainService

@pytest.mark.asyncio
async def test_create_slug():
    slug = "my-test-slug"
    website_id = uuid4() 

    mock_service = AsyncMock()
    mock_service.create_slug.return_value = None

    app.dependency_overrides[SlugMainService] = lambda: mock_service

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.post("/api/v1/slug/slug", json={
            "slug": slug,
            "website_id": str(website_id)
        })

    assert response.status_code == 200
    assert response.json() == {"slug": slug, "website_id": str(website_id),}
    mock_service.create_slug.assert_called_once_with(slug, website_id)


@pytest.mark.asyncio
async def test_get_slug():
    slug = "test-slug"
    website_id = uuid4()

    mock_service = AsyncMock()
    mock_service.get_website_id.return_value = website_id

    app.dependency_overrides[SlugMainService] = lambda: mock_service

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
        response = await client.get(f"/api/v1/slug/slug/{slug}")

    assert response.status_code == 200
    assert response.json() == {"website_id": str(website_id)}
    mock_service.get_website_id.assert_called_once_with(slug)