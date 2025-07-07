from app.services.admin_service import AdminService
from app.domain.schemas.admin_schema import ShopPlanStatsSchema  
from typing import Annotated
from fastapi import Depends

class AdminMainService:
    def __init__(self,admin_service: Annotated[AdminService, Depends()],):
        self.admin_service = admin_service

    async def get_shop_plan_stats(self) -> ShopPlanStatsSchema:
        return await self.admin_service.get_dashboard_shop_stats()
    

    async def get_user_and_seller_stats(self):
        return await self.admin_service.get_user_and_seller_stats()
    
    async def get_total_revenue(self) -> int:
        return await self.admin_service.get_total_revenue()
    
    async def get_website_activity_stats(self):
        return await self.admin_service.get_website_activity_stats()
    
