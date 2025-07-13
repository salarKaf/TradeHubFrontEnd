from sqlalchemy.orm import Session
from app.domain.models.website_model import Coupon
from app.core.postgres_db.database import get_db
from fastapi import Depends
from typing import Annotated, Optional

class CouponRepository:
    def __init__(self,db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def create_coupon(self, coupon: Coupon) -> Coupon:
        self.db.add(coupon)
        self.db.commit()
        self.db.refresh(coupon)
        return coupon
    

    def get_coupon_by_code(self, code: str) -> Optional[Coupon]:
        return self.db.query(Coupon).filter_by(code=code).first()
    
    def update_coupon(self, coupon: Coupon) -> Coupon:
        self.db.add(coupon)
        self.db.commit()
        self.db.refresh(coupon)
        return coupon