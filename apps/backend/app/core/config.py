"""
Configuration settings for Meovis Backend
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Meovis API"
    VERSION: str = "0.1.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]
    
    # Database
    DATABASE_URL: str = "sqlite://./meovis.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # File Upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    UPLOAD_DIR: str = "uploads"
    DATASET_UPLOAD_DIR: str = "uploads/datasets"
    MODEL_UPLOAD_DIR: str = "uploads/models"
    ALLOWED_MODEL_EXTENSIONS: List[str] = [".pkl", ".joblib", ".pt"]
    ALLOWED_DATASET_EXTENSIONS: List[str] = [".csv", ".json"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    
    # ML Settings
    SHAP_SAMPLE_SIZE: int = 1000
    MAX_FEATURES_FOR_SHAP: int = 50
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Create upload directories if they don't exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.DATASET_UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MODEL_UPLOAD_DIR, exist_ok=True)
