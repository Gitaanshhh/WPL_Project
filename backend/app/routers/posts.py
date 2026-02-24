from fastapi import APIRouter, HTTPException, status
from typing import List

from ..schemas.post import PostCreate, PostUpdate, PostResponse
from ..crud import posts as posts_crud

router = APIRouter(prefix="/api/posts", tags=["posts"])

@router.get("/", response_model=List[PostResponse])
async def get_posts(skip: int = 0, limit: int = 20):
    """Get all posts"""
    posts = await posts_crud.get_posts(skip=skip, limit=limit)
    return posts

@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    """Get a single post by ID"""
    post = await posts_crud.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate):
    """Create a new post (requires authentication in production)"""
    # TODO: Get current user from JWT token
    # For now, use a dummy author_id - you'll replace this with actual auth
    author_id = "temp_user_id"
    
    created_post = await posts_crud.create_post(post, author_id)
    return created_post

@router.put("/{post_id}", response_model=PostResponse)
async def update_post(post_id: str, post_update: PostUpdate):
    """Update a post"""
    updated_post = await posts_crud.update_post(post_id, post_update)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated_post

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: str):
    """Delete a post (soft delete)"""
    success = await posts_crud.delete_post(post_id)
    if not success:
        raise HTTPException(status_code=404, detail="Post not found")
    return None
