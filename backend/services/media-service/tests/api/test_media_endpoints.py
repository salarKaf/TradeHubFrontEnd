import pytest
from uuid import uuid4
from unittest.mock import AsyncMock
from httpx import AsyncClient
from fastapi import status, UploadFile
from io import BytesIO
from app.main import app
from app.api.v1.endpoints.website_media_routes import media_router
from app.domain.schemas.token_schema import TokenDataSchema
from app.domain.schemas.media_schema import MediaSchema
from httpx import ASGITransport
from app.api.v1.endpoints import website_media_routes

from bson import ObjectId
from app.domain.schemas.media_schema import MediaSchema

@pytest.mark.asyncio
async def test_upload_banner(monkeypatch):
    fake_website_id = uuid4()
    fake_user_id = uuid4()

    mock_file = UploadFile(filename="test.png", file=BytesIO(b"fake image"))

    mock_media_service = AsyncMock()
    mock_media_service.create_media.return_value = MediaSchema(
        mongo_id=ObjectId(),
        filename="test.png",
        content_type="image/png",
        size=1024,
        user_id=str(fake_user_id),
        message="Banner uploaded successfully"
    )

    mock_website_service = AsyncMock()
    mock_website_service.update_website.return_value = None

    app.dependency_overrides[website_media_routes.get_current_user] = lambda: TokenDataSchema(
        user_id=fake_user_id,
        email="test@user.com",
        first_name="Test",
        last_name="User"
    )
    app.dependency_overrides[website_media_routes.MediaService] = lambda: mock_media_service
    app.dependency_overrides[website_media_routes.WebsiteMainService] = lambda: mock_website_service

    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {'file': ('test.png', b'fake image', 'image/png')}
        response = await client.put(f"/api/v1/website/upload_banner/{fake_website_id}", files=files)

    assert response.status_code == status.HTTP_201_CREATED
    assert response.json()["filename"] == "test.png"
    assert response.json()["message"] == "Banner uploaded successfully"


from fastapi.responses import StreamingResponse
from bson import ObjectId
from datetime import datetime

@pytest.mark.asyncio
async def test_get_banner(monkeypatch):
    fake_website_id = uuid4()
    mongo_id = ObjectId()

    mock_website_service = AsyncMock()
    mock_website_service.get_website_by_id.return_value = AsyncMock(banner_image=str(mongo_id))

    mock_media_schema = MediaSchema(
        mongo_id=str(mongo_id),
        filename="banner.png",
        content_type="image/png",
        size=2048,
        user_id="fake_user_id",
        message="Mocked banner upload"
    )

    mock_file_stream = lambda: BytesIO(b"image-data")

    mock_media_service = AsyncMock()
    mock_media_service.get_public_media.return_value = (mock_media_schema, mock_file_stream)

    app.dependency_overrides[website_media_routes.WebsiteMainService] = lambda: mock_website_service
    app.dependency_overrides[website_media_routes.MediaService] = lambda: mock_media_service

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(f"/api/v1/website/get_banner/{fake_website_id}")

    assert response.status_code == status.HTTP_200_OK
    assert response.headers["content-disposition"] == f"inline; filename={mock_media_schema.filename}"
