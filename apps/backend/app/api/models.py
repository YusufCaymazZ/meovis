"""
Models API router
Handles model upload, analysis, and visualization endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
import os
import uuid
from typing import List

from app.models.ml_model import MLModel, MLModel_Pydantic, MLModelIn_Pydantic
from app.services.ml_service import MLService
from app.core.config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/upload", response_model=MLModel_Pydantic)
@limiter.limit("5/minute")
async def upload_model(
    file: UploadFile = File(...),
    name: str = None,
    description: str = None,
    model_type: str = "classification"
):
    """
    Upload a machine learning model file (.pkl or .joblib)
    """
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.ALLOWED_MODEL_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {settings.ALLOWED_MODEL_EXTENSIONS}"
        )
    
    # Validate file size
    if file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {settings.MAX_FILE_SIZE / (1024*1024)}MB"
        )
    
    # Generate unique filename
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving file: {str(e)}")
    
    # Create model record
    model_data = {
        "name": name or file.filename,
        "description": description,
        "file_path": file_path,
        "model_type": model_type
    }
    
    model = await MLModel.create(**model_data)
    return await MLModel_Pydantic.from_tortoise_orm(model)


@router.get("/", response_model=List[MLModel_Pydantic])
async def list_models():
    """
    List all uploaded models
    """
    models = await MLModel.all()
    return [await MLModel_Pydantic.from_tortoise_orm(model) for model in models]


@router.get("/{model_id}", response_model=MLModel_Pydantic)
async def get_model(model_id: int):
    """
    Get a specific model by ID
    """
    model = await MLModel.get_or_none(id=model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    return await MLModel_Pydantic.from_tortoise_orm(model)


@router.delete("/{model_id}")
async def delete_model(model_id: int):
    """
    Delete a model and its file
    """
    model = await MLModel.get_or_none(id=model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Delete file
    try:
        if os.path.exists(model.file_path):
            os.remove(model.file_path)
    except Exception as e:
        # Log error but continue with database deletion
        print(f"Error deleting file {model.file_path}: {e}")
    
    # Delete from database
    await model.delete()
    return {"message": "Model deleted successfully"}


@router.post("/{model_id}/analyze")
async def analyze_model(model_id: int, dataset_id: int):
    """
    Analyze a model with a dataset
    """
    # Get model and dataset
    model = await MLModel.get_or_none(id=model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    from app.models.ml_model import Dataset
    dataset = await Dataset.get_or_none(id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Analyze model
    try:
        ml_service = MLService()
        results = await ml_service.analyze_model(model, dataset)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/{model_id}/visualizations")
async def get_model_visualizations(model_id: int):
    """
    Get visualization data for a model
    """
    model = await MLModel.get_or_none(id=model_id)
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    
    # Get latest prediction for visualizations
    from app.models.ml_model import Prediction
    prediction = await Prediction.filter(model_id=model_id).order_by("-created_at").first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="No analysis results found")
    
    return {
        "model_id": model_id,
        "prediction_id": prediction.id,
        "metrics": prediction.metrics,
        "shap_values": prediction.shap_values
    }
