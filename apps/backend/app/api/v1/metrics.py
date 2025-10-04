"""
Metrics API endpoints for MVP
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Union

from app.services.ml_service import MLService
from app.schemas.metrics import EvaluationRequest, EvaluationResponse
from app.core.config import settings

# Create router
router = APIRouter()

# Initialize ML service
ml_service = MLService()


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(evaluation_request: EvaluationRequest):
    """Evaluate model performance metrics"""
    try:
        # Validate input lengths
        if len(evaluation_request.y_true) != len(evaluation_request.y_pred):
            raise HTTPException(
                status_code=400, 
                detail="y_true and y_pred must have the same length"
            )
        
        # Evaluate metrics
        result = ml_service.evaluate_metrics(
            evaluation_request.y_true,
            evaluation_request.y_pred,
            evaluation_request.task_type
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        
        return EvaluationResponse(
            success=True,
            task_type=result["task_type"],
            metrics=result["metrics"],
            message=result["message"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
