import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.redis.redis_client import redis_client 
from unittest.mock import MagicMock
from app.core.configs.config import get_settings
from redis import Redis


@pytest.fixture()
def client():
    with TestClient(app) as client:
        yield client


@pytest.fixture()
def redis():
    # Create a Redis connection for testing
    redis_client = Redis(host='localhost', port=6379, db=0)
    yield redis_client
    redis_client.flushall()  # Clear Redis after each test to avoid data contamination.

@pytest.fixture()
def mock_redis_client(mocker):
    # Mock the Redis client
    mock_client = MagicMock(Redis)
    mocker.patch('app.core.redis.redis_client', mock_client)
    return mock_client

def test_register_with_mocked_redis(mock_redis_client, client):
    # Your test logic goes here
    
    # Mock Redis behavior for the test
    mock_redis_client.setex.return_value = True  # Example: Mock the setex method to return True

    user_data = {
        "email": "testuser1@example.com",
        "password": "password123",
        "confirm_password": "password123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    response = client.post("/api/v1/users/Register", json=user_data)  # Use the correct prefix and data
    
    assert response.status_code == 201
    assert "email" in response.json()
    assert response.json()["email"] == "testuser1@example.com"

def test_resend_otp(client, redis):
    email = "testuser1@example.com"
    
    # Simulate OTP being set in Redis (you would typically mock this part if needed)
    otp = "123456"  # Example OTP
    redis.setex(email, 300, otp)  # OTP expires in 5 minutes
    
    resend_otp_data = {
        "email": email
    }
    
    # Call the resend OTP endpoint
    response = client.post("/api/v1/users/ResendOTP", json=resend_otp_data)
    
    # Verify the response status
    assert response.status_code == 200
    
    # Check the message returned in the response
    assert "message" in response.json()
    assert response.json()["message"] == "OTP Resent"
    
    # Check if the OTP was updated in Redis (a new OTP should have been set)
    new_otp = redis.get(email)
    assert new_otp is not None  # Ensure the OTP is still there
    assert new_otp != otp  # Check if the OTP was changed (i.e., resent)


def test_verify_otp(client, redis):
    otp = "123456"  # In a real test, you would retrieve this from Redis or mock it

    # Simulating the OTP being saved in Redis during registration
    redis.setex("testuser1@example.com", 300, otp)  # OTP expires in 5 minutes

    otp_data = {
        "email": "testuser1@example.com",
        "otp": otp
    }

    # Test OTP verification
    response = client.post("/api/v1/users/VerifyOTP", json=otp_data)
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "User Verified Successfully"


def test_login(client):
    login_data = {
        "grant_type": "password",  # Specify the grant_type as 'password'
        "username": "testuser1@example.com",  # Use 'username' (email in this case)
        "password": "password123",  # Provide the correct password,
        "scope": "",
        "client_id": "string",
        "client_secret": "string"
    }

    # Send the POST request to the login endpoint
    response = client.post("/api/v1/users/login", json=login_data)

    # Assert the status code of the response is 200 OK
    assert response.status_code == 200
    
    # Ensure the response contains the access token
    assert "access_token" in response.json()
    
    # Extract the access token from the response
    token = response.json()["access_token"]
    
    # Use the token to test other authenticated endpoints
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users/Me", headers=headers)
    
    # Ensure the response for the 'Me' endpoint is 200 OK and the email matches the one provided
    assert response.status_code == 200
    assert response.json()["email"] == "testuser1@example.com"



def test_update_profile(client):
    login_data = {
        "username": "testuser1@example.com",
        "password": "password123"
    }
    
    # Get the valid token from the login function
    login_response = client.post("/api/v1/users/login", json=login_data)
    
    # Ensure the login was successful
    assert login_response.status_code == 200
    token = login_response.json().get("access_token")

    headers = {"Authorization": f"Bearer {token}"}
    update_data = {
        "name": "Updated User"
    }
    
    # Send the PUT request to the update profile endpoint
    response = client.put("/api/v1/users/UpdateProfile", json=update_data, headers=headers)
    
    # Assert the status code of the response is 200 OK
    assert response.status_code == 200
    assert response.json()["name"] == "Updated User"

def test_read_me(client):
    login_data = {
        "username": "testuser1@example.com",
        "password": "password123"
    }
    
    # Get the valid token from the login function
    login_response = client.post("/api/v1/users/login", json=login_data)
    
    # Ensure the login was successful
    assert login_response.status_code == 200
    token = login_response.json().get("access_token")

    headers = {"Authorization": f"Bearer {token}"}
    
    # Send the GET request to the 'Me' endpoint
    response = client.get("/api/v1/users/Me", headers=headers)
    
    # Assert the status code of the response is 200 OK
    assert response.status_code == 200
    assert response.json()["email"] == "testuser1@example.com"
