from typing import Annotated
from loguru import logger
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.domain.models.user_model import User
from app.infrastructure.clients.iam_client import IAMClient
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="http://iam.localhost/api/v1/users/login")

async def get_current_user(
    client: Annotated[IAMClient, Depends()],
    token: Annotated[str, Depends(oauth2_scheme)]
) -> User:
        if not token:
            logger.error("No token provided")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unauthorized",
            )

        logger.info(f"Validating token {token}")
        return await client.validate_token(token)
