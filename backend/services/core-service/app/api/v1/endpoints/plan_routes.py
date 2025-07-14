from fastapi import APIRouter, Depends, status
from typing import Annotated, List
from app.services.plan_service import PlanService
from uuid import UUID
from loguru import logger

plan_router = APIRouter()



@plan_router.get("/get-all-plans/")
async def get_question_by_id(
    plan_service: Annotated[PlanService, Depends()]
):
    return await plan_service.get_all_plans()
