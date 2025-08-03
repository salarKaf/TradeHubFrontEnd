from unittest.mock import MagicMock 
import pytest
from uuid import uuid4
from unittest.mock import AsyncMock
from datetime import datetime

from app.services.review_main_service import ReviewMainService
from app.domain.schemas.review_schema import ReviewResponseSchema
from app.domain.models.review_model import Review
from unittest.mock import MagicMock 

@pytest.mark.asyncio
async def test_create_review_service():
    buyer_id = uuid4()
    website_id = uuid4()
    item_id = uuid4()

    mock_review = Review(
        review_id=uuid4(),
        buyer_id=buyer_id,
        website_id=website_id,
        item_id=item_id,
        rating=5,
        text="Great!",
        created_at=datetime.utcnow()
    )

    review_service = AsyncMock()
    review_service.create_review.return_value = mock_review

    mock_buyer = MagicMock()
    mock_buyer.name = "Test Buyer"
    buyer_service = AsyncMock()
    buyer_service.get_buyer_by_id.return_value = mock_buyer

    service = ReviewMainService(
        review_service=review_service,
        buyer_service=buyer_service
    )

    result = await service.create_review(
        buyer_id=buyer_id,
        website_id=website_id,
        item_id=item_id,
        rating=5,
        text="Great!"
    )

    assert result.rating == 5
    assert result.text == "Great!"
    assert result.buyer_name == "Test Buyer"
