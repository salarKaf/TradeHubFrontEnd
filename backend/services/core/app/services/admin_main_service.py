
from app.services.admin_service import AdminService
from app.services.plan_service import PlanService
from app.services.website_service import WebsiteService
from app.domain.schemas.admin_schema import ShopPlanStatsSchema, TopWebsiteSchema, WebsiteListSchema 
from typing import Annotated, List
from fastapi import Depends

class AdminMainService:
    def __init__(self,
                 admin_service: Annotated[AdminService, Depends()],
                 website_service: Annotated[WebsiteService, Depends()],
                 plan_service: Annotated[PlanService, Depends()],):
        self.admin_service = admin_service
        self.plan_service = plan_service
        self.website_service = website_service

    async def get_shop_plan_stats(self) -> ShopPlanStatsSchema:
        return await self.admin_service.get_dashboard_shop_stats()
    

    async def get_user_and_seller_stats(self):
        return await self.admin_service.get_user_and_seller_stats()
    
    async def get_total_revenue(self) -> int:
        return await self.admin_service.get_total_revenue()
    
    async def get_website_activity_stats(self):
        return await self.admin_service.get_website_activity_stats()

    async def get_top_websites(self, sort_by: str , limit: int ) -> list[TopWebsiteSchema]:
        websites = await self.plan_service.get_all_websites() 
        result = []

        for site in websites:
            income_data = await self.website_service.get_total_revenue(site.website_id)
            total_income = income_data.get("total_revenue", 0)

            sales_count = await self.website_service.get_total_sales_count(site.website_id)
            owner_email = await self.website_service.get_website_owner_email(site.website_id)
            website_plan = await self.plan_service.get_active_plan_by_website_id(site.website_id)
            plan = await self.plan_service.get_plan_by_id(website_plan.plan_id)

            result.append(TopWebsiteSchema(
                website_id=str(site.website_id),
                website_name=site.business_name,
                is_active = website_plan.is_active if website_plan else False,
                owner_email=owner_email,  
                plan_name = plan.name if plan else "Inactive",
                total_income=total_income,
                total_orders=sales_count
            ))

        if sort_by == "income":
            result.sort(key=lambda website: website.total_income, reverse=True)
        elif sort_by == "sales":
            result.sort(key=lambda website: website.total_orders, reverse=True)

        top_websites = result[:limit]
        return top_websites
    


    async def get_website_table(self, sort_by: str) -> list[WebsiteListSchema]:
            websites = await self.website_service.get_all_websites()   

            result = []
            for site in websites:
                income_data = await self.website_service.get_total_revenue(site.website_id)
                total_income = income_data.get("total_revenue", 0)

                owner_emails = await self.website_service.get_website_owner_email(site.website_id)
                website_plan = await self.plan_service.get_active_plan_by_website_id(site.website_id)

                if website_plan:
                    plan = await self.plan_service.get_plan_by_id(website_plan.plan_id)
                    plan_name = plan.name if plan else "Unknown"
                    is_plan_active = website_plan.is_active
                else:
                    plan_name = "Inactive"
                    is_plan_active = False


                result.append(WebsiteListSchema(
                    website_id=site.website_id,
                    website_name=site.business_name,
                    is_active=is_plan_active,
                    created_at=site.created_at,
                    owner_emails=owner_emails,
                    plan_name=plan_name,
                    total_income=total_income or 0
                ))

            if sort_by == "revenue":
                result.sort(key=lambda x: x.total_income, reverse=True)
            else:
                result.sort(key=lambda x: x.created_at, reverse=True)

            return result