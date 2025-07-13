from sqlalchemy.orm import Session
from app.domain.models.website_model import Coupon
from app.core.postgres_db.database import get_db
from fastapi import Depends
from typing import Annotated 

class CouponRepository:
    def __init__(self,db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_coupon(self, coupon: Coupon) -> Coupon:
        self.db.add(coupon)
        self.db.commit()
        self.db.refresh(coupon)
        return coupon