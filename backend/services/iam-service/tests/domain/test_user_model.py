from app.domain.models.user_model import User

def test_user_model_fields():
    user = User(
        first_name="A",
        last_name="B",
        email="a@b.com",
        password="123"
    )
    assert user.email == "a@b.com"
    assert user.first_name == "A"
