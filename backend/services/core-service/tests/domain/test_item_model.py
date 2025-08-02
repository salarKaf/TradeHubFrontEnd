from app.domain.models.item_model import Item
from uuid import uuid4
from datetime import datetime

def test_item_model_fields():
    item = Item(
        item_id=uuid4(),
        website_id=uuid4(),
        category_id=uuid4(),
        subcategory_id=None,
        name="Sample Item",
        description="This is a sample item",
        price=99.99,
        discount_price=79.99,
        discount_active=True,
        discount_percent=20,
        discount_expires_at=datetime.utcnow(),
        delivery_url="https://example.com/delivery",
        post_purchase_note="Thanks for your order",
        stock=10,
        is_available=True,
        created_at=datetime.utcnow()
    )

    assert item.name == "Sample Item"
    assert item.price == 99.99
    assert item.discount_active is True
    assert item.is_available is True
    assert item.stock == 10
