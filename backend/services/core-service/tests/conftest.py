import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)
from app.services.auth_services.user_auth_service import get_current_user
from app.domain.schemas.token_schema import TokenDataSchema
from uuid import uuid4

def override_get_current_user():
    return TokenDataSchema(user_id=uuid4(),
        first_name="Test",
        last_name="User",
        email="test@yahoo.com"
    )

@pytest.fixture(autouse=True)
def auto_override_user(monkeypatch):
    from app.main import app
    app.dependency_overrides[get_current_user] = override_get_current_user

