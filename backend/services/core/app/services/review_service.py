
from app.domain.models.review_model import Review
from loguru import logger
from app.infrastructure.repositories.review_repository import ReviewRepository
from typing import Annotated
from fastapi import HTTPException, Depends

class ReviewService:
    def __init__(self,
        review_repository: Annotated[ReviewRepository, Depends()],
        ):
        self.review_repository = review_repository

    async def create_review(self, buyer_id, website_id, item_id, rating, text):
        created_review = self.review_repository.create_review(buyer_id, website_id, item_id, rating, text)
        logger.info(f"Review created for item {created_review.item_id} by buyer {created_review.buyer_id}")
        return created_review

