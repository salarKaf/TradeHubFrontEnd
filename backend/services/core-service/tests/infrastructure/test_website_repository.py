from app.infrastructure.repositories.website_repository import WebsiteRepository
from app.domain.models.website_model import Website
from unittest.mock import MagicMock
import uuid


def test_create_website():
    mock_session = MagicMock()
    repo = WebsiteRepository(mock_session)

    website = Website(
        website_id=uuid.uuid4(),
        business_name="Test Store",
        welcome_text="Welcome to our store!"
    )

    repo.create_website(website)

    assert mock_session.add.called
    assert mock_session.commit.called
