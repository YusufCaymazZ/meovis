"""
Model API endpoints for MVP
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
import os
import uuid
from datetime import datetime

from app.services.ml_service import MLService
from app.schemas.model import ModelUploadResponse, PredictionRequest, PredictionResponse
from app.core.config import settings

# Create router
router = APIRouter()

# Initialize ML service
ml_service = MLService()


@router.post("/upload-model", response_model=ModelUploadResponse)
async def upload_model(file: UploadFile = File(...)):
    """Upload a model file (.pkl, .joblib, or .pt)"""
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.ALLOWED_MODEL_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_ext} not allowed. Allowed types: {settings.ALLOWED_MODEL_EXTENSIONS}"
            )
        
        # Check file size
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{file_ext}"
        file_path = os.path.join(settings.MODEL_UPLOAD_DIR, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Load model to get info
        model_info = ml_service.load_model(file_path)
        if not model_info["success"]:
            # Clean up file if loading failed
            os.remove(file_path)
            raise HTTPException(status_code=400, detail=model_info["message"])
        
        return ModelUploadResponse(
            success=True,
            filename=filename,
            file_path=file_path,
            model_type="sklearn",  # Default for MVP
            algorithm=model_info["model_info"]["algorithm"],
            size_bytes=file.size,
            uploaded_at=datetime.now(),
            message="Model uploaded successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.post("/predict", response_model=PredictionResponse)
async def predict(prediction_request: PredictionRequest):
    """Make predictions using the loaded model"""
    try:
        # Make predictions
        result = ml_service.predict(prediction_request.data)
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        
        return PredictionResponse(
            success=True,
            predictions=result["predictions"],
            probabilities=result.get("probabilities"),
            model_info=result["model_info"],
            message=result["message"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")