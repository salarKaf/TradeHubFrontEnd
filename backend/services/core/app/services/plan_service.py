from app.infrastructure.repositories.plan_repository import PlanRepository
from app.infrastructure.repositories.item_repository import ItemRepository
from app.domain.models.website_model import WebsitePlan
from uuid import UUID
from fastapi import HTTPException, Depends
from app.services.base_service import BaseService
from typing import Annotated
from loguru import logger




class PlanService:
    def __init__(
        self,
        plan_repository: Annotated[PlanRepository, Depends()],
        item_repository: Annotated[ItemRepository, Depends()],

    ) -> None:
        super().__init__()  
        self.plan_repository = plan_repository
        self.item_repository = item_repository



    async def get_active_plan_by_website_id(self, website_id: UUID) -> WebsitePlan:
        logger.info(f"Fetching active plan for website ID: {website_id}")
        return self.plan_repository.get_active_plan_by_website_id(website_id)
    
        
    async def check_item_limit(self, website_id: UUID):
        active_plan = await self.get_active_plan_by_website_id(website_id)

        if not active_plan:
            raise HTTPException(status_code=403, detail="No active plan for this website.")
        logger.info(f"Active plan for website ID: {website_id} is {active_plan}")


        item_count = self.item_repository.count_items_by_website_id(website_id)

        if item_count >= active_plan.plan.item_limit:
            raise HTTPException(status_code=403, detail="Item limit exceeded for this plan.")


