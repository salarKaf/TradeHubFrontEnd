from typing import Annotated
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.postgres_db.database import get_db
from app.domain.models.website_model import WebsitePlan, SubscriptionPlan
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import joinedload
from dateutil.relativedelta import relativedelta

class PlanRepository:
    def __init__(self, db: Annotated[Session, Depends(get_db)]):
        self.db = db

    def deactivate_expired_plans(self):
        now = datetime.utcnow()
        expired_plans = self.db.query(WebsitePlan).filter(
            WebsitePlan.expires_at <= now,
            WebsitePlan.is_active == True
        ).all()
        for plan in expired_plans:
            plan.is_active = False
        self.db.commit()
        return expired_plans

    def get_active_plan_by_website_id(self, website_id: UUID) -> WebsitePlan:
        return (
            self.db.query(WebsitePlan).options(joinedload(WebsitePlan.plan))
            .filter(WebsitePlan.website_id == website_id, WebsitePlan.is_active == True)
            .first()
        )

    def get_plan_price(self, name: UUID) -> float:
        plan = self.db.query(SubscriptionPlan).filter(
            SubscriptionPlan.name == name).first()

        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")

        return plan.price

    def get_plan_by_id(self, plan_id: UUID) -> SubscriptionPlan:
        return self.db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_id == plan_id).first()


    def deactivate_all_website_plans(self, website_id):
            self.db.query(WebsitePlan)\
                .filter(WebsitePlan.website_id == website_id, WebsitePlan.is_active == True)\
                .update({WebsitePlan.is_active: False})
            self.db.commit()

    def create_website_plan(self, website_id, plan_id, price):
        activated_at=datetime.utcnow()
        expires_at = activated_at + relativedelta(months=3)
        website_plan = WebsitePlan(
            website_id=website_id,
            plan_id=plan_id,
            activated_at=activated_at,
            expires_at=expires_at,
            is_active=True
        )
        self.db.add(website_plan)
        self.db.commit()
        self.db.refresh(website_plan)
        return website_plan