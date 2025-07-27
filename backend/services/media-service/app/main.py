from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import logging

from app.api.v1.endpoints.website_media_routes import media_router
from app.api.v1.endpoints.item_imag_routes import item_media_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,
)

logger = logging.getLogger(__name__)
logger.info("Custom logging is configured.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(media_router, prefix="/api/v1/website", tags=["website_media"])
app.include_router(item_media_router, prefix="/api/v1/item", tags=["item_media"])

logger.info("Media Service Started")


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to Media Service."}
