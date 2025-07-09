from typing import Annotated
from loguru import logger
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.user_service import UserService
from app.domain.models.user_model import User

http_bearer = HTTPBearer() 

async def get_current_user(
    user_service: Annotated[UserService, Depends()],
    token: HTTPAuthorizationCredentials = Depends(http_bearer), 

) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    logger.info(f"Validating token for user {token}")
    
    try:

        payload = jwt.decode(
            token.credentials,
            user_service.config.JWT_SECRET_KEY,
            algorithms=[user_service.config.JWT_ALGORITHM],
        )
        user_id: str = payload.get("sub")
        role: str = payload.get("role") 

        if role != "user":
            raise credentials_exception

        user = await user_service.get_user_by_id(user_id)
        if not user:
            logger.error("User not found")
            raise credentials_exception

    except jwt.PyJWTError:
        logger.error("Error decoding token")
        raise credentials_exception

    logger.info(f"User with id {user_id} validated successfully")
    return user