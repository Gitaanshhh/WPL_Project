"""Posts API endpoints"""

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from ...schemas.post import PostCreate, PostUpdate, PostResponse
from ...services import post_service
from ...core.database import get_db

router = APIRouter()


@router.get("/", response_model=List[PostResponse])
async def get_posts(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    """Get all posts"""
    posts = await post_service.get_posts(db, skip=skip, limit=limit)
    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single post by ID"""
    post = await post_service.get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate, db: AsyncSession = Depends(get_db)):
    """Create a new post (requires authentication in production)"""
    # TODO: Get current user from JWT token
    # For now, use a dummy author_id - you'll replace this with actual auth
    author_id = "temp_user_id"
    
    created_post = await post_service.create_post(db, post, author_id)
    return created_post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(post_id: str, post_update: PostUpdate, db: AsyncSession = Depends(get_db)):
    """Update a post"""
    updated_post = await post_service.update_post(db, post_id, post_update)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated_post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a post (soft delete)"""
    success = await post_service.delete_post(db, post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return None
