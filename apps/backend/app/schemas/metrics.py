"""
Metrics schemas for API requests and responses
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional, Union
from datetime import datetime


class EvaluationRequest(BaseModel):
    """Request schema for model evaluation"""
    y_true: List[Union[int, float]]
    y_pred: List[Union[int, float]]
    task_type: str = "classification"  # "classification" or "regression"


class ClassificationMetrics(BaseModel):
    """Classification metrics schema"""
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    classification_report: Dict[str, Any]


class RegressionMetrics(BaseModel):
    """Regression metrics schema"""
    mse: float
    rmse: float
    mae: float
    r2_score: float


class EvaluationResponse(BaseModel):
    """Response schema for model evaluation"""
    success: bool
    task_type: str
    metrics: Union[ClassificationMetrics, RegressionMetrics]
    message: str


class MetricsSummary(BaseModel):
    """Summary of all metrics"""
    task_type: str
    primary_metric: str
    primary_value: float
    all_metrics: Dict[str, Any]
    timestamp: datetime
