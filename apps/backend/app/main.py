"""
Meovis Backend - FastAPI Application
Main entry point for the ML visualization API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import init_db, close_db
from app.api.v1 import models, datasets, metrics

# Create FastAPI app
app = FastAPI(
    title="Meovis API",
    description="ML Model Visualization and Analysis API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure for production
)

# Include routers
app.include_router(models.router, prefix="/api/v1/models", tags=["models"])
app.include_router(datasets.router, prefix="/api/v1/datasets", tags=["datasets"])
app.include_router(metrics.router, prefix="/api/v1/metrics", tags=["metrics"])


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()


@app.on_event("shutdown")
async def shutdown_event():
    """Close database on shutdown"""
    await close_db()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Meovis API",
        "version": "0.1.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "meovis-api"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
