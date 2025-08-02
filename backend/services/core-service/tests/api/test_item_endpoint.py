import pytest
from uuid import uuid4
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.domain.schemas.item_schema import NewestItemResponseSchema
from fastapi import status
from datetime import datetime, timezone
from httpx._transports.asgi import ASGITransport

@pytest.mark.asyncio
async def test_create_item():
    mock_user_id = str(uuid4())
    mock_item_data = {
        "website_id": str(uuid4()),
        "category_id": str(uuid4()),
        "name": "Sample Item",
        "description": "This is a test item.",
        "price": 19.99,
        "delivery_url": "http://delivery.com",
        "stock": 10
    }

    mock_created_item = {
        "item_id": str(uuid4()),
        **mock_item_data,
        "subcategory_id": None,
        "discount_price": None,
        "discount_active": False,
        "discount_percent": 0,
        "discount_expires_at": None,
        "post_purchase_note": None,
        "is_available": True,
        "created_at": datetime.utcnow().isoformat()
    }

    with patch("app.services.item_main_service.ItemMainService.create_item", new=AsyncMock(return_value=mock_created_item)), \
         patch("app.services.auth_services.user_auth_service.get_current_user", return_value={"user_id": mock_user_id}):

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.post(
                "/api/v1/items/create_item",
                json=mock_item_data,
                headers={"Authorization": "Bearer test-token"}
            )

    assert response.status_code == 201
    assert response.json()["name"] == "Sample Item"



@pytest.mark.asyncio
async def test_get_item_by_id():
    item_id = uuid4()
    
    mock_item_data = {
    "item_id": item_id,
    "website_id": uuid4(),
    "category_id": uuid4(),
    "subcategory_id": None,
    "name": "Test Item",
    "description": "A test item",
    "price": 99.99,
    "discount_price": None,
    "discount_active": False,
    "discount_expires_at": None,
    "delivery_url": "http://delivery.test/item",
    "post_purchase_note": None,
    "stock": 5,
    "is_available": True,
    "created_at": datetime.now(timezone.utc).isoformat(),
    "category_name": "Electronics",       
    "sales_count": 12,              
    "rating": 4                         
    }   


    with patch(
        "app.services.item_main_service.ItemMainService.get_item_by_id",
        new=AsyncMock(return_value=mock_item_data)
    ):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver") as client:
            response = await client.get(f"/api/v1/items/items/{item_id}")

    assert response.status_code == status.HTTP_200_OK
    assert response.json()["item_id"] == str(item_id)
    assert response.json()["name"] == "Test Item"
    assert float(response.json()["price"]) == 99.99
