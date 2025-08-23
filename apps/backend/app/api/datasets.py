"""
Datasets API router
Handles dataset upload and management endpoints
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address
import os
import uuid
import pandas as pd
from typing import List

from app.models.ml_model import Dataset, Dataset_Pydantic, DatasetIn_Pydantic
from app.core.config import settings

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)


@router.post("/upload", response_model=Dataset_Pydantic)
@limiter.limit("5/minute")
async def upload_dataset(
    file: UploadFile = File(...),
    name: str = None,
    description: str = None,
    target_column: str = None
):
    """
    Upload a dataset file (.csv)
    """
    # Validate file extension
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.ALLOWED_DATASET_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {settings.ALLOWED_DATASET_EXTENSIONS}"
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
    
    # Analyze dataset
    try:
        df = pd.read_csv(file_path)
        row_count = len(df)
        column_count = len(df.columns)
        
        # Validate target column if provided
        if target_column and target_column not in df.columns:
            raise HTTPException(
                status_code=400,
                detail=f"Target column '{target_column}' not found in dataset"
            )
        
    except Exception as e:
        # Clean up file if analysis fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Invalid CSV file: {str(e)}")
    
    # Create dataset record
    dataset_data = {
        "name": name or file.filename,
        "description": description,
        "file_path": file_path,
        "row_count": row_count,
        "column_count": column_count,
        "target_column": target_column
    }
    
    dataset = await Dataset.create(**dataset_data)
    return await Dataset_Pydantic.from_tortoise_orm(dataset)


@router.get("/", response_model=List[Dataset_Pydantic])
async def list_datasets():
    """
    List all uploaded datasets
    """
    datasets = await Dataset.all()
    return [await Dataset_Pydantic.from_tortoise_orm(dataset) for dataset in datasets]


@router.get("/{dataset_id}", response_model=Dataset_Pydantic)
async def get_dataset(dataset_id: int):
    """
    Get a specific dataset by ID
    """
    dataset = await Dataset.get_or_none(id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    return await Dataset_Pydantic.from_tortoise_orm(dataset)


@router.get("/{dataset_id}/preview")
async def preview_dataset(dataset_id: int, rows: int = 10):
    """
    Preview dataset data (first N rows)
    """
    dataset = await Dataset.get_or_none(id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        df = pd.read_csv(dataset.file_path)
        preview_data = df.head(rows).to_dict(orient="records")
        
        return {
            "dataset_id": dataset_id,
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": df.columns.tolist(),
            "preview": preview_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading dataset: {str(e)}")


@router.get("/{dataset_id}/info")
async def get_dataset_info(dataset_id: int):
    """
    Get detailed information about a dataset
    """
    dataset = await Dataset.get_or_none(id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        df = pd.read_csv(dataset.file_path)
        
        # Basic info
        info = {
            "dataset_id": dataset_id,
            "name": dataset.name,
            "description": dataset.description,
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": df.columns.tolist(),
            "target_column": dataset.target_column,
            "created_at": dataset.created_at.isoformat()
        }
        
        # Data types
        info["dtypes"] = df.dtypes.to_dict()
        
        # Missing values
        info["missing_values"] = df.isnull().sum().to_dict()
        
        # Basic statistics for numeric columns
        numeric_columns = df.select_dtypes(include=['number']).columns
        if len(numeric_columns) > 0:
            info["numeric_stats"] = df[numeric_columns].describe().to_dict()
        
        # Categorical columns info
        categorical_columns = df.select_dtypes(include=['object']).columns
        if len(categorical_columns) > 0:
            info["categorical_info"] = {}
            for col in categorical_columns:
                info["categorical_info"][col] = {
                    "unique_values": df[col].nunique(),
                    "most_common": df[col].value_counts().head(5).to_dict()
                }
        
        return info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing dataset: {str(e)}")


@router.delete("/{dataset_id}")
async def delete_dataset(dataset_id: int):
    """
    Delete a dataset and its file
    """
    dataset = await Dataset.get_or_none(id=dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Delete file
    try:
        if os.path.exists(dataset.file_path):
            os.remove(dataset.file_path)
    except Exception as e:
        # Log error but continue with database deletion
        print(f"Error deleting file {dataset.file_path}: {e}")
    
    # Delete from database
    await dataset.delete()
    return {"message": "Dataset deleted successfully"}
