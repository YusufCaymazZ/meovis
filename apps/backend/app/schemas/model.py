"""
Model schemas for API requests and responses
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from datetime import datetime


class ModelUploadResponse(BaseModel):
    """Response schema for model upload"""
    success: bool
    filename: str
    file_path: str
    model_type: str
    algorithm: str
    size_bytes: int
    uploaded_at: datetime
    message: str


class PredictionRequest(BaseModel):
    """Request schema for model prediction"""
    data: Union[List[Dict[str, Any]], Dict[str, Any]]
    model_id: Optional[str] = None


class PredictionResponse(BaseModel):
    """Response schema for model prediction"""
    success: bool
    predictions: List[Union[int, float]]
    probabilities: Optional[List[List[float]]] = None
    model_info: Dict[str, Any]
    message: str


class ModelInfo(BaseModel):
    """Model information schema"""
    filename: str
    file_path: str
    model_type: str
    algorithm: str
    size_bytes: int
    uploaded_at: datetime
    parameters: Optional[Dict[str, Any]] = None
    feature_names: Optional[List[str]] = None
    feature_importances: Optional[List[float]] = None
