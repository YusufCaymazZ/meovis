"""
Dataset API endpoints for MVP
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional
import os
import uuid
from datetime import datetime

from app.services.ml_service import MLService
from app.schemas.dataset import DatasetUploadResponse, DatasetPreviewResponse
from app.core.config import settings

# Create router
router = APIRouter()

# Initialize ML service
ml_service = MLService()


@router.post("/upload-dataset", response_model=DatasetUploadResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    target_column: Optional[str] = Form(None)
):
    """Upload a dataset file (CSV or JSON)"""
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.ALLOWED_DATASET_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file_ext} not allowed. Allowed types: {settings.ALLOWED_DATASET_EXTENSIONS}"
            )
        
        # Check file size
        if file.size and file.size > settings.MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        filename = f"{file_id}{file_ext}"
        file_path = os.path.join(settings.DATASET_UPLOAD_DIR, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Load dataset to get info
        dataset_info = ml_service.load_dataset(file_path)
        if not dataset_info["success"]:
            # Clean up file if loading failed
            os.remove(file_path)
            raise HTTPException(status_code=400, detail=dataset_info["message"])
        
        return DatasetUploadResponse(
            success=True,
            filename=filename,
            file_path=file_path,
            shape=dataset_info["dataset_info"]["shape"],
            columns=dataset_info["dataset_info"]["columns"],
            message="Dataset uploaded successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


@router.get("/preview-dataset")
async def preview_dataset(file_path: str):
    """Preview the first 10 rows of a dataset"""
    try:
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
        
        # Load dataset
        dataset_info = ml_service.load_dataset(file_path)
        if not dataset_info["success"]:
            raise HTTPException(status_code=400, detail=dataset_info["message"])
        
        return DatasetPreviewResponse(
            success=True,
            data=dataset_info["dataset_info"]["preview"],
            columns=dataset_info["dataset_info"]["columns"],
            shape=dataset_info["dataset_info"]["shape"],
            message="Dataset preview generated successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Preview failed: {str(e)}")