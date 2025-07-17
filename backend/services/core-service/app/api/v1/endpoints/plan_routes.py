from fastapi import APIRouter, Depends, status
from typing import Annotated, List
from app.services.plan_service import PlanService
from uuid import UUID
from app.services.auth_services.auth_service import get_current_user
from app.domain.schemas.token_schema import TokenDataSchema

plan_router = APIRouter()



@plan_router.get("/get-all-plans/")
async def get_all_plans(
    plan_service: Annotated[PlanService, Depends()]
):
    return await plan_service.get_all_plans()


@plan_router.post("/activate-free-plan", status_code=status.HTTP_201_CREATED)
async def activate_free_plan(
    website_id:UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    plan_service: Annotated[PlanService, Depends()]
):
    await plan_service.activate_free_plan(website_id)
    return {"free plan activated successfuly"}


@plan_router.get("/check-plan-history/")
async def check_plan_history(
    website_id:UUID,
    plan_service: Annotated[PlanService, Depends()]
):
    return await plan_service.check_had_plan(website_id)



@plan_router.get("/get-left-days/")
async def get_left_days(
    website_id:UUID,
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
    plan_service: Annotated[PlanService, Depends()]
):
    return await plan_service.get_left_days(website_id)
