"""
AcademiaHub Backend API

To run:
cd backend
uvicorn app.main:app --reload

API Documentation: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import api_router
from app.core.config import settings
from app.core.database import close_database_connection


# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Academic social platform API with PostgreSQL backend",
    version="1.0.0"
)

# CORS middleware for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 routers
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.on_event("shutdown")
async def shutdown():
    """Close database connection on shutdown"""
    await close_database_connection()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AcademiaHub API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Backend is running",
        "database": "PostgreSQL"
    }