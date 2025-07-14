from fastapi import HTTPException, Depends
from app.domain.schemas.coupon_schema import CouponCreateSchema, CouponResponseSchema
from app.domain.models.website_model import Coupon
from app.infrastructure.repositories.coupon_repository import CouponRepository
from uuid import UUID
from app.infrastructure.repositories.website_repository import WebsiteRepository
from typing import Annotated, List
from loguru import logger


class CouponMainService:
    def __init__(
        self,
        coupon_repository: Annotated[CouponRepository, Depends()],
        website_repository: Annotated[WebsiteRepository, Depends()],
    ):
        self.coupon_repository = coupon_repository
        self.website_repository = website_repository

    async def create_coupon(
        self,
        coupon_data: CouponCreateSchema
    ) -> CouponResponseSchema:
        logger.info(f"Starting create_coupon with data: {coupon_data.dict()}")

        website = self.website_repository.get_website_by_id(coupon_data.website_id)
        if not website:
            raise HTTPException(status_code=404, detail="Website not found")

        new_coupon = Coupon(
            website_id=coupon_data.website_id,
            code=coupon_data.code,
            discount_amount=coupon_data.discount_amount,
            expiration_date=coupon_data.expiration_date,
            usage_limit=coupon_data.usage_limit,
        )

        created = self.coupon_repository.create_coupon(new_coupon)
        logger.info(f"Coupon created: {created.coupon_id}")

        return CouponResponseSchema(
            id=created.coupon_id,
            website_id=created.website_id,
            code=created.code,
            discount_amount=created.discount_amount,
            expiration_date=created.expiration_date,
            usage_limit=created.usage_limit,
            times_used=created.times_used,
            created_at=created.created_at,
        )

    async def get_coupon_by_code(self, coupon_code:str) ->Coupon:
        return self.coupon_repository.get_coupon_by_code(coupon_code)
    

    async def get_coupons_by_website_id(self, website_id: UUID) -> List[CouponResponseSchema]:
        website = self.website_repository.get_website_by_id(website_id)
        if not website:
            raise HTTPException(status_code=404, detail="Website not found")

        coupons = self.coupon_repository.get_coupons_by_website_id(website_id)
        return [CouponResponseSchema.from_orm(c) for c in coupons]


    async def delete_coupon(self, coupon_id: UUID) -> None:
        coupon = self.coupon_repository.get_coupon_by_id(coupon_id)
        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")

        self.coupon_repository.delete_coupon(coupon_id)
