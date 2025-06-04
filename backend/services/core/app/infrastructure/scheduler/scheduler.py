from app.infrastructure.repositories.cart_repository import CartRepository
from app.infrastructure.repositories.plan_repository import PlanRepository
from loguru import logger
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime

class SchedulerService:
    def __init__(self, plan_repository: PlanRepository):
        self.scheduler = BackgroundScheduler()
        self.plan_repository = plan_repository
    def start(self):
        logger.info("🔄 Starting background job scheduler...")
        self.scheduler.add_job(self.deactivate_expired_plans, 'interval', hours=24)
        self.scheduler.start()

    def deactivate_expired_plans(self):
        self.plan_repository.deactivate_expired_plans()



class CartCleanupScheduler:
    def __init__(self, cart_repository: CartRepository):
        self.scheduler = BackgroundScheduler()
        self.cart_repository = cart_repository

    def start(self):
        logger.info("🔄 Starting cart cleanup scheduler...")
        self.scheduler.add_job(self.cleanup_expired_items, 'interval', hours=2)
        self.scheduler.start()

    def cleanup_expired_items(self):
        now = datetime.utcnow()
        self.cart_repository.delete_expired_items(now)
        logger.info("Expired cart items cleaned up.")