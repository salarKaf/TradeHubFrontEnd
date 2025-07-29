
from app.core.postgres_db.postgres_database import get_db
from app.infrastructure.storage.gridfs_storage import GridFsStorage
from app.infrastructure.repositories.media_repository import MediaRepository
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config.config import get_settings
from app.infrastructure.scheduler.scheduler import MediaCleanupScheduler
setting = get_settings()
def get_mongo_db() -> AsyncIOMotorDatabase:
    client = AsyncIOMotorClient(setting.DATABASE_URL)
    return client["mongodb"]

def starter():
    db = get_mongo_db()
    media_repo = MediaRepository(db)
    storage = GridFsStorage(db)

    media_scheduler = MediaCleanupScheduler(media_repo, storage)
    media_scheduler.start()