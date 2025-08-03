from app.infrastructure.repositories.review_repository import ReviewRepository
from app.domain.models.review_model import Review
from unittest.mock import MagicMock
from uuid import uuid4

def test_create_review_repo():
    mock_session = MagicMock()
    repo = ReviewRepository(mock_session)

    buyer_id = uuid4()
    website_id = uuid4()
    item_id = uuid4()

    repo.create_review(buyer_id, website_id, item_id, 4, "Nice!")

    assert mock_session.add.called
    assert mock_session.commit.called
    assert mock_session.refresh.called