
from fastapi import APIRouter, Depends 
from app.services.admin_main_service import AdminMainService
from app.domain.schemas.admin_schema import ShopPlanStatsSchema
from typing import Annotated, List
from uuid import UUID
from app.services.auth_services.auth_service import get_current_admin
from app.domain.schemas.token_schema import TokenDataSchema
from loguru import logger

admin_router = APIRouter()

@admin_router.get("/dashboard/stats", response_model=ShopPlanStatsSchema)
async def get_dashboard_stats(
    admin_main_service: Annotated[AdminMainService, Depends()],
    current_admin: Annotated[TokenDataSchema,Depends(get_current_admin)]
):
    return await admin_main_service.get_shop_plan_stats()


@admin_router.get("/dashboard/user-seller-stats")
async def get_user_and_seller_stats(
    admin_main_service: Annotated[AdminMainService, Depends()],
    current_admin: Annotated[TokenDataSchema,Depends(get_current_admin)]
):
    return await admin_main_service.get_user_and_seller_stats()


@admin_router.get("/dashboard/revenue")
async def get_revenue(
    admin_service: Annotated[AdminMainService, Depends()],
    current_admin: Annotated[TokenDataSchema,Depends(get_current_admin)]):
    
    return {"total_revenue": await admin_service.get_total_revenue()}


@admin_router.get("/dashboard/website-activity")
async def get_website_activity_stats(
    admin_main_service: Annotated[AdminMainService, Depends()],
     current_admin: Annotated[TokenDataSchema,Depends(get_current_admin)]
):
    return await admin_main_service.get_website_activity_stats()