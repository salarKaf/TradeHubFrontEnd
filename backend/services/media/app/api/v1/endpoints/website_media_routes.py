from typing import Annotated
from loguru import logger
from fastapi import APIRouter, Depends, UploadFile, status, Form
from fastapi.responses import StreamingResponse

from app.domain.schemas.media_schema import MediaGetSchema, MediaSchema
from app.domain.schemas.token_schema import TokenDataSchema
from app.services.media_service import MediaService
from app.services.auth_service import get_current_user
from uuid import UUID
from app.validator.validator import validate_image_file
from app.services.website_main_service import WebsiteMainService
from app.domain.schemas.website_schema import WebsiteUpdateSchema



media_router = APIRouter()

@media_router.put(
    "/upload_banner/{website_id}",
    response_model=MediaSchema,
    status_code=status.HTTP_201_CREATED
)
async def upload_banner(
    website_id: UUID,
    file: UploadFile,
    media_service: Annotated[MediaService, Depends()],
    website_service: Annotated[WebsiteMainService, Depends()],
    current_user: Annotated[TokenDataSchema, Depends(get_current_user)],
):
    logger.info(f"Validating banner file")
    validate_image_file(file) 

    logger.info(f"Uploading banner for website {website_id} {file.filename}")
    output = await media_service.create_media(file, str(current_user.user_id))

    update_data = WebsiteUpdateSchema(
        website_id=website_id,
        banner_image=str(output.mongo_id)
    )
    logger.info(f"Saving media id in website with id: {website_id}")
    await website_service.update_website(update_data, current_user.user_id)
    
    await website_service.update_website(update_data, current_user.user_id)

    return output





