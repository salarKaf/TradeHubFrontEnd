import pytest
from uuid import uuid4
from unittest.mock import AsyncMock
from app.services.item_main_service import ItemMainService
from app.domain.schemas.item_schema import ItemCreateSchema
from app.domain.models.item_model import Item
from datetime import datetime

@pytest.mark.asyncio
async def test_create_item_main_service():
    website_id = uuid4()
    category_id = uuid4()
    item_data = ItemCreateSchema(
        website_id=website_id,
        category_id=category_id,
        subcategory_id=None,
        name="Test Item",
        description="Test Description",
        price=150.0,
        delivery_url="http://delivery.com",
        post_purchase_note=None,
        stock=5,
    )

    mock_item = Item(
        item_id=uuid4(),
        website_id=item_data.website_id,
        category_id=item_data.category_id,
        subcategory_id=item_data.subcategory_id,
        name=item_data.name,
        description=item_data.description,
        price=item_data.price,
        discount_price=None,
        discount_active=False,
        discount_percent=0,
        discount_expires_at=None,
        delivery_url=item_data.delivery_url,
        post_purchase_note=None,
        stock=item_data.stock,
        is_available=True,
        created_at=datetime.now()
    )

    item_service = AsyncMock()
    item_service.create_item.return_value = mock_item
    plan_service = AsyncMock()
    plan_service.check_item_limit.return_value = None

    service = ItemMainService(
        item_service=item_service,
        website_service=AsyncMock(),
        plan_service=plan_service,
        order_service=AsyncMock(),
        review_service=AsyncMock()
    )

    result = await service.create_item(item_data)

    assert result.name == "Test Item"
    assert result.price == 150.0
    item_service.create_item.assert_called_once()
    plan_service.check_item_limit.assert_called_once_with(website_id)
