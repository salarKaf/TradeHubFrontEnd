from uuid import UUID
from app.domain.schemas.review_schema import ReviewCreateSchema, ReviewResponseSchema
from loguru import logger
from app.services.review_service import ReviewService
from fastapi import HTTPException, Depends
from typing import Annotated, List


class ReviewMainService:
    def __init__(self,
        review_service: Annotated[ReviewService, Depends()],
        ) :
        self.review_service = review_service

    async def create_review(self, buyer_id: UUID, website_id: UUID, item_id:UUID , rating:int , text:str) -> ReviewResponseSchema:
        new_review =  await self.review_service.create_review(buyer_id, website_id, item_id, rating, text)
        return ReviewResponseSchema(
            review_id= new_review.review_id, 
            item_id= new_review.item_id, 
            buyer_id= new_review.buyer_id, 
            website_id= new_review.website_id, 
            rating= new_review.rating, 
            text= new_review.text, 
            created_at= new_review.created_at
        )
    

    async def get_review_by_id(self, review_id:UUID) -> ReviewResponseSchema:
        review = await self.review_service.get_review_by_id(review_id)
        return ReviewResponseSchema(
            review_id= review.review_id, 
            item_id= review.item_id, 
            buyer_id= review.buyer_id, 
            website_id= review.website_id, 
            rating= review.rating, 
            text= review.text, 
            created_at= review.created_at
        )
    

    async def get_reviews_for_item(self, item_id:UUID) -> List[ReviewResponseSchema]:
        reviews =  await self.review_service.get_item_reviews(item_id)
        return [
        ReviewResponseSchema(
            review_id=review.review_id,
            item_id=review.item_id,
            buyer_id=review.buyer_id,
            website_id=review.website_id,
            rating=review.rating,
            text=review.text,
            created_at=review.created_at
        )
        for review in reviews
    ]