from app.infrastructure.repositories.plan_repository import PlanRepository
from app.domain.models.website_model import WebsitePlan
from uuid import UUID
from fastapi import HTTPException, Depends
from app.services.base_service import BaseService
from typing import Annotated
from loguru import logger




class PlanService:
    def __init__(
        self,
        plan_repository: Annotated[WebsitePlan, Depends()],
    ) -> None:
        super().__init__()  
        self.plan_repository = plan_repository


    async def get_active_plan_by_website_id(self, website_id: UUID) -> WebsitePlan:
        logger.info(f"Fetching active plan for website ID: {website_id}")
        return self.plan_repository.get_active_plan_by_website_id(website_id)
        


