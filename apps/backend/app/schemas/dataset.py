"""
Dataset schemas for API requests and responses
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime


class DatasetUploadResponse(BaseModel):
    """Response schema for dataset upload"""
    success: bool
    filename: str
    file_path: str
    shape: tuple
    columns: List[str]
    message: str


class DatasetPreviewResponse(BaseModel):
    """Response schema for dataset preview"""
    success: bool
    data: List[Dict[str, Any]]
    columns: List[str]
    shape: tuple
    message: str


class DatasetInfo(BaseModel):
    """Dataset information schema"""
    filename: str
    file_path: str
    shape: tuple
    columns: List[str]
    uploaded_at: datetime


class DatasetUploadRequest(BaseModel):
    """Request schema for dataset upload validation"""
    target_column: Optional[str] = None
    has_header: bool = True
    delimiter: str = ","
