from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "academiahub"
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()

# MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)
database = client[settings.DATABASE_NAME]

# Collections
users_collection = database.get_collection("users")
posts_collection = database.get_collection("posts")
topics_collection = database.get_collection("topics")
votes_collection = database.get_collection("votes")
reports_collection = database.get_collection("reports")

# Helper to get database
async def get_database():
    return database

# Close database connection on shutdown
async def close_database_connection():
    client.close()
