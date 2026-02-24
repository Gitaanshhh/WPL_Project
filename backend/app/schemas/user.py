from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    GENERAL = "General User"
    VERIFIED = "Verified User"
    MODERATOR = "Moderator"
    DEVELOPER = "Developer"
    ADMINISTRATOR = "Administrator"

class UserStatus(str, Enum):
    ACTIVE = "active"
    WARNED = "warned"
    BANNED = "banned"

# What API receives when creating a user
class UserCreate(BaseModel):
    email: EmailStr
    password: str  # Will be hashed before storing
    name: str

# What API returns (never send password back!)
class UserResponse(BaseModel):
    id: str = Field(alias="_id")  # MongoDB uses _id, we want id
    email: EmailStr
    name: str
    role: UserRole
    status: UserStatus
    created_at: datetime
    # Optional profile details
    university: Optional[str] = None
    pronouns: Optional[str] = None
    bio: Optional[str] = None
    
    class Config:
        populate_by_name = True  # Accept both _id and id as field names

# For updating user profile
class UserUpdate(BaseModel):
    name: Optional[str] = None
    university: Optional[str] = None
    pronouns: Optional[str] = None
    bio: Optional[str] = None