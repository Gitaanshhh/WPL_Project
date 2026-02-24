"""
AcademiaHub Backend API

To run:
cd backend
uvicorn app.main:app --reload

API Documentation: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import posts

# Create FastAPI app
app = FastAPI(
    title="AcademiaHub API",
    description="Academic social platform API with MongoDB backend",
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

# Include routers
app.include_router(posts.router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AcademiaHub API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Backend is running",
        "database": "MongoDB Atlas"
    }