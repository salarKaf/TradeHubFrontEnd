from  app.domain.schemas.admin_schema import AdminLoginSchema
from  app.domain.schemas.token_schema import TokenSchema, TokenDataSchema
from  app.services.auth_services.auth_service import AuthService
from  app.services.admin_service import AdminService
from  app.services.auth_services.auth_service import get_current_admin
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from loguru import logger

admin_router = APIRouter()

@admin_router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    auth_service: Annotated[AuthService, Depends()],
) -> TokenSchema:

    logger.info(f"Logging in admin with email {form_data.username}")
    return await auth_service.authenticate_admin(
        AdminLoginSchema(email=form_data.username, password=form_data.password)
    )    