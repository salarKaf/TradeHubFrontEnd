from app.domain.models.review_model import Review
from uuid import uuid4
from datetime import datetime

def test_review_model_fields():
    now = datetime.utcnow()
    review = Review(
        review_id=uuid4(),
        buyer_id=uuid4(),
        website_id=uuid4(),
        item_id=uuid4(),
        rating=5,
        text="Awesome!",
        created_at=now
    )

    assert review.rating == 5
    assert review.text == "Awesome!"
    assert review.created_at == now
