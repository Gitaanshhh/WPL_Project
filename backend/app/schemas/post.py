from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# What API receives when creating a post
class PostCreate(BaseModel):
    topic: str
    title: str
    content: str
    references: List[str]  # List of URLs/citations

# For updating posts - all fields optional (update only what changed)
class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    references: Optional[List[str]] = None

# What API returns
class PostResponse(BaseModel):
    id: str = Field(alias="_id")  # MongoDB uses _id, we want id
    author_id: str
    topic: str
    title: str
    content: str
    references: List[str]
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True  # Accept both _id and id as field names
