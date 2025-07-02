import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    force=True,
)
from app.infrastructure.repositories.cart_repository import CartRepository
logger = logging.getLogger(__name__)
logger.info("Custom logging is configured.")
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.v1.endpoints.websites_routes import website_router
from app.api.v1.endpoints.item_routes import item_router
from app.api.v1.endpoints.order_routes import order_router
from app.infrastructure.scheduler.scheduler import SchedulerService, CartCleanupScheduler
from app.api.v1.endpoints.cart_routes import cart_router
from app.api.v1.endpoints.payment_routes import payment_router
from app.api.v1.endpoints.review_routes import review_router
from app.api.v1.endpoints.qan_routes import qan_router

app = FastAPI()

from app.core.postgres_db.database import get_db
from app.infrastructure.repositories.plan_repository import PlanRepository

# @app.on_event("startup")
# async def start_scheduler():
#     db = next(get_db()) 
#     plan_repo = PlanRepository(db)
#     cart_repo = CartRepository(db)
#     check_plan_scheduler = SchedulerService(plan_repo)
#     expire_cart_scheduler = CartCleanupScheduler(cart_repo)
#     check_plan_scheduler.start()
#     expire_cart_scheduler.start()


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
app.include_router(cart_router, prefix="/api/v1/carts", tags=["carts"])
app.include_router(order_router, prefix="/api/v1/order", tags=["orders"])
app.include_router(payment_router, prefix="/api/v1/payment", tags=["payments"])
app.include_router(review_router, prefix="/api/v1/review", tags=["reviews"])
app.include_router(qan_router, prefix="/api/v1/question", tags=["questions"])


@app.get("/")
async def root():
    return {"message": "Hello Dear! Welcome to the Core service."}

