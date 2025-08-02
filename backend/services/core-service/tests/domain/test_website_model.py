from app.domain.models.website_model import Website
import uuid


def test_website_model_fields():
    website = Website(
        website_id=uuid.uuid4(),
        business_name="Test Shop",
        welcome_text="Welcome!",
    )

    assert website.business_name == "Test Shop"

