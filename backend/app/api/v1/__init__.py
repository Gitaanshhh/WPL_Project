"""API v1 routers"""

from fastapi import APIRouter
from .posts import router as posts_router

api_router = APIRouter()
api_router.include_router(posts_router, prefix="/posts", tags=["posts"])

__all__ = ["api_router"]
