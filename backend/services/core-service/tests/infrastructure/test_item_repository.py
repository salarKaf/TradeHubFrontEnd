from app.infrastructure.repositories.item_repository import ItemRepository
from app.domain.models.item_model import Item
from unittest.mock import MagicMock
import uuid

def test_create_item_repository():
    mock_session = MagicMock()
    repo = ItemRepository(mock_session)

    item = Item(
        item_id=uuid.uuid4(),
        website_id=uuid.uuid4(),
        category_id=uuid.uuid4(),
        subcategory_id=None,
        name="Test Item",
        description="A test item",
        price=100.00,
        delivery_url="http://delivery.com",
        stock=10,
        is_available=True
    )

    repo.create_item(item)

    assert mock_session.add.called
    assert mock_session.commit.called
    assert mock_session.refresh.called
