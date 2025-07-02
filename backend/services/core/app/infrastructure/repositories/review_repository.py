from typing import Annotated
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.review_model import Review
from uuid import UUID

class ReviewRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_review(self, buyer_id, website_id, item_id, rating, text):
        review = Review(
            buyer_id=buyer_id,
            website_id=website_id,
            item_id=item_id,
            rating=rating,
            text=text
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review