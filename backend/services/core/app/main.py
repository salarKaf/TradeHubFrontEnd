import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,
)

logger = logging.getLogger(__name__)
logger.info("Custom logging is configured.")
import smtplib
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from app.api.v1.endpoints.websites_routes import website_router
from app.api.v1.endpoints.item_routes import item_router

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.info("Core Service Started")
app.include_router(website_router, prefix="/api/v1/websites", tags=["websites"])
app.include_router(item_router, prefix="/api/v1/items", tags=["items"])


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to the Core service."}

