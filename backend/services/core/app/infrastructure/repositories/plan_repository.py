from typing import Annotated, Dict
from loguru import logger
from fastapi import Depends
from sqlalchemy.orm import Session
from  app.core.postgres_db.database import get_db
from  app.domain.models.website_model import WebsitePlan
from datetime import datetime
from uuid import UUID


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
          self.db.query(WebsitePlan)
          .filter(WebsitePlan.website_id == website_id, WebsitePlan.is_active == True)
          .first()
      )
