"""
Database configuration and initialization
"""

from tortoise import Tortoise
from app.core.config import settings


async def init_db():
    """Initialize database connection and create tables"""
    await Tortoise.init(
        db_url=settings.DATABASE_URL,
        modules={"models": ["app.models.ml_model"]}
    )
    
    # Generate schemas
    await Tortoise.generate_schemas()


async def close_db():
    """Close database connection"""
    await Tortoise.close_connections()
