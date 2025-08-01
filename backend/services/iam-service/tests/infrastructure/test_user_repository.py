# tests/infrastructure/test_user_repository.py
from app.infrastructure.repositories.user_repository import UserRepository
from app.domain.models.user_model import User
from unittest.mock import MagicMock
import uuid

def test_create_user():
    mock_session = MagicMock()
    repo = UserRepository(mock_session)
    user = User(
        user_id=uuid.uuid4(),
        first_name="Test",
        last_name="User",
        email="test@e.com",
        password="hashed"
    )
    repo.create_user(user)
    assert mock_session.add.called
    assert mock_session.commit.called
