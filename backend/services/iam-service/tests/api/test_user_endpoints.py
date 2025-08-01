# tests/api/v1/test_user_endpoints.py
import pytest
from fastapi.testclient import TestClient
from app.main import app
from unittest.mock import AsyncMock, patch

client = TestClient(app)
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.user_model import User
import pytest


@pytest.mark.asyncio
async def test_register_verify_login_flow(client):
    payload = {
        "first_name": "Ali",
        "last_name": "Naderi",
        "email": "ali1377@gmail.com",
        "password": "strongpass123",
        "confirm_password": "strongpass123"
    }
    res_register = client.post("/api/v1/users/Register", json=payload)
    print("REGISTER RESP:", res_register.status_code, res_register.json())

    assert res_register.status_code in [201, 400]

    db: Session = next(get_db())
    user = db.query(User).filter_by(email="ali@gmail.com").first()
    if user:
        user.is_verified = True
        db.commit()

    with patch("app.services.user_main_service.RegisterService.verify_user", new=AsyncMock()) as mocked_verify:
        mocked_verify.return_value = {
            "access_token": "fake_token",
            "token_type": "bearer"
        }
        res_verify = client.post("/api/v1/users/VerifyOTP", json={
            "email": "ali1377@gmail.com",
            "otp": "123456"
        })
        print("REGISTER RESP:", res_register.status_code, res_register.json())

        assert res_verify.status_code == 200

    res_login = client.post("/api/v1/users/login", data={
        "username": "ali1377@gmail.com",
        "password": "strongpass123"
    })
    assert res_login.status_code in [200, 401]
