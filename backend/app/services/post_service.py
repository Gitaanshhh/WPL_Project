"""Post service - Business logic for post operations"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import List, Optional

from ..models.post import Post
from ..schemas.post import PostCreate, PostUpdate, PostResponse


async def create_post(db: AsyncSession, post: PostCreate, author_id: str) -> PostResponse:
    """Create a new post"""
    db_post = Post(
        author_id=author_id,
        topic=post.topic,
        title=post.title,
        content=post.content,
        references=post.references,
        is_deleted=False,
        created_at=datetime.utcnow(),
        updated_at=None
    )
    
    db.add(db_post)
    await db.commit()
    await db.refresh(db_post)
    
    return PostResponse(
        _id=str(db_post.id),
        author_id=db_post.author_id,
        topic=db_post.topic,
        title=db_post.title,
        content=db_post.content,
        references=db_post.references,
        created_at=db_post.created_at,
        updated_at=db_post.updated_at
    )


async def get_posts(db: AsyncSession, skip: int = 0, limit: int = 20) -> List[PostResponse]:
    """Get all posts (not deleted)"""
    result = await db.execute(
        select(Post)
        .where(Post.is_deleted == False)
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    posts = result.scalars().all()
    
    return [
        PostResponse(
            _id=str(post.id),
            author_id=post.author_id,
            topic=post.topic,
            title=post.title,
            content=post.content,
            references=post.references,
            created_at=post.created_at,
            updated_at=post.updated_at
        )
        for post in posts
    ]


async def get_post_by_id(db: AsyncSession, post_id: str) -> Optional[PostResponse]:
    """Get a single post by ID"""
    try:
        post_id_int = int(post_id)
    except ValueError:
        return None
    
    result = await db.execute(
        select(Post)
        .where(Post.id == post_id_int, Post.is_deleted == False)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        return None
    
    return PostResponse(
        _id=str(post.id),
        author_id=post.author_id,
        topic=post.topic,
        title=post.title,
        content=post.content,
        references=post.references,
        created_at=post.created_at,
        updated_at=post.updated_at
    )


async def update_post(db: AsyncSession, post_id: str, post_update: PostUpdate) -> Optional[PostResponse]:
    """Update a post"""
    try:
        post_id_int = int(post_id)
    except ValueError:
        return None
    
    result = await db.execute(
        select(Post)
        .where(Post.id == post_id_int, Post.is_deleted == False)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        return None
    
    update_data = post_update.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(post, field, value)
    
    post.updated_at = datetime.utcnow()
    
    await db.commit()
    await db.refresh(post)
    
    return PostResponse(
        _id=str(post.id),
        author_id=post.author_id,
        topic=post.topic,
        title=post.title,
        content=post.content,
        references=post.references,
        created_at=post.created_at,
        updated_at=post.updated_at
    )


async def delete_post(db: AsyncSession, post_id: str) -> bool:
    """Soft delete a post"""
    try:
        post_id_int = int(post_id)
    except ValueError:
        return False
    
    result = await db.execute(
        select(Post)
        .where(Post.id == post_id_int)
    )
    post = result.scalar_one_or_none()
    
    if not post:
        return False
    
    post.is_deleted = True
    await db.commit()
    
    return True
