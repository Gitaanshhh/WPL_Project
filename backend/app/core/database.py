"""Database setup and session management"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from .config import settings


# SQLAlchemy engine
engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


# Base class for models
class Base(DeclarativeBase):
    pass


# Dependency to get database session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


# Initialize database tables
async def init_db():
    """Create all database tables"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Close database connection on shutdown
async def close_database_connection():
    """Dispose of database engine"""
    await engine.dispose()
