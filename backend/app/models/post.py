"""Post model"""

from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Text, Boolean, DateTime, ARRAY
from datetime import datetime
from typing import Optional, List

from ..core.database import Base


class Post(Base):
    """Post database model"""
    
    __tablename__ = "posts"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    author_id: Mapped[str] = mapped_column(String(255), nullable=False)  # Will be int when auth is implemented
    topic: Mapped[str] = mapped_column(String(255), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    references: Mapped[List[str]] = mapped_column(ARRAY(String), default=list)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
