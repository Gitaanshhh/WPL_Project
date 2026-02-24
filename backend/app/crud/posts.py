from bson import ObjectId
from datetime import datetime
from typing import List, Optional

from ..database import posts_collection
from ..schemas.post import PostCreate, PostUpdate, PostResponse

async def create_post(post: PostCreate, author_id: str) -> PostResponse:
    """Create a new post"""
    post_dict = {
        "author_id": author_id,
        "topic": post.topic,
        "title": post.title,
        "content": post.content,
        "references": post.references,
        "is_deleted": False,
        "created_at": datetime.utcnow(),
        "updated_at": None
    }
    
    result = await posts_collection.insert_one(post_dict)
    post_dict["_id"] = str(result.inserted_id)
    
    return PostResponse(**post_dict)

async def get_posts(skip: int = 0, limit: int = 20) -> List[PostResponse]:
    """Get all posts (not deleted)"""
    cursor = posts_collection.find(
        {"is_deleted": False}
    ).sort("created_at", -1).skip(skip).limit(limit)
    
    posts = []
    async for post in cursor:
        post["_id"] = str(post["_id"])
        posts.append(PostResponse(**post))
    
    return posts

async def get_post_by_id(post_id: str) -> Optional[PostResponse]:
    """Get a single post by ID"""
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id), "is_deleted": False})
    except:
        return None
    
    if not post:
        return None
    
    post["_id"] = str(post["_id"])
    return PostResponse(**post)

async def update_post(post_id: str, post_update: PostUpdate) -> Optional[PostResponse]:
    """Update a post"""
    update_data = {k: v for k, v in post_update.dict().items() if v is not None}
    
    if not update_data:
        return await get_post_by_id(post_id)
    
    update_data["updated_at"] = datetime.utcnow()
    
    try:
        result = await posts_collection.update_one(
            {"_id": ObjectId(post_id), "is_deleted": False},
            {"$set": update_data}
        )
    except:
        return None
    
    if result.modified_count == 0:
        return None
    
    return await get_post_by_id(post_id)

async def delete_post(post_id: str) -> bool:
    """Soft delete a post"""
    try:
        result = await posts_collection.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": {"is_deleted": True}}
        )
    except:
        return False
    
    return result.modified_count > 0
