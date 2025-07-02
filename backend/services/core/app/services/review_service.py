
from app.domain.models.review_model import Review
from loguru import logger
from app.infrastructure.repositories.review_repository import ReviewRepository
from typing import Annotated, List
from fastapi import HTTPException, Depends

class ReviewService:
    def __init__(self,
        review_repository: Annotated[ReviewRepository, Depends()],
        ):
        self.review_repository = review_repository

    async def create_review(self, buyer_id, website_id, item_id, rating, text) -> Review:
        created_review = self.review_repository.create_review(buyer_id, website_id, item_id, rating, text)
        logger.info(f"Review created for item {created_review.item_id} by buyer {created_review.buyer_id}")
        return created_review
    

    async def get_review_by_id(self, review_id) -> Review:
        review = self.review_repository.get_review_by_id(review_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        return review


    async def get_item_reviews(self, item_id) -> List[Review]:
        reviews = self.review_repository.get_reviews_by_item(item_id)
        if not reviews:
            raise HTTPException(status_code=404, detail="No review was found")
        return reviews
