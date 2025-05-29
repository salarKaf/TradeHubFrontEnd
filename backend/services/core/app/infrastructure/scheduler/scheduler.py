from app.infrastructure.repositories.plan_repository import PlanRepository
from loguru import logger
from apscheduler.schedulers.background import BackgroundScheduler

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
