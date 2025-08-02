import pytest
from uuid import uuid4
from app.domain.schemas.website_schema import WebsiteCreateSchema
from app.services.website_main_service import WebsiteMainService
from unittest.mock import AsyncMock
from types import SimpleNamespace

@pytest.mark.asyncio
async def test_create_website_main_service():
    user_id = uuid4()
    mock_website = WebsiteCreateSchema(
    business_name= "Test Shop",
    welcome_text= "Welcome to our store!"
    )


    mock_created = SimpleNamespace(
        website_id=uuid4(),
        business_name=mock_website.business_name,
        welcome_text=mock_website.welcome_text,
        guide_page=None,
        store_policy=[],
        store_slogan=None,
        social_links=None,
        faqs=None,
        about_us=None,
        logo_url=None,
        banner_image=None
    )


    mock_user_service = AsyncMock()
    mock_user_service.check_is_owner.return_value = None

    mock_website_service = AsyncMock()
    mock_website_service.create_website.return_value = mock_created

    service = WebsiteMainService(
        website_service=mock_website_service,
        user_service=mock_user_service,
        plan_service=AsyncMock(),
    )

    result = await service.create_website(user_id, mock_website)
    assert result.business_name == mock_website.business_name
    mock_website_service.create_website.assert_awaited_once()
