# tests/services/test_user_service.py
import pytest
from app.services.user_service import UserService
from app.domain.schemas.user_schema import UserCreateSchema
from unittest.mock import MagicMock

@pytest.fixture
def mock_user_repo():
    return MagicMock()

@pytest.fixture
def mock_hash_service():
    mock = MagicMock()
    mock.hash_password.return_value = "hashed_password"
    return mock

@pytest.fixture
def user_service(mock_user_repo, mock_hash_service):
    return UserService(user_repository=mock_user_repo, hash_service=mock_hash_service)


@pytest.mark.asyncio
async def test_create_user(user_service, mock_user_repo):
    schema = UserCreateSchema(
        first_name="Ali",
        last_name="Tester",
        email="a@b.com",
        password="123456",
        confirm_password="123456"
    )
    await user_service.create_user(schema)
    assert mock_user_repo.create_user.called