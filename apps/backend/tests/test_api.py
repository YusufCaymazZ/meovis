"""
Basic API tests for MVP endpoints
"""

import pytest
import httpx
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestDatasetAPI:
    """Test dataset upload and preview endpoints"""
    
    def test_upload_dataset_invalid_file_type(self):
        """Test uploading invalid file type"""
        response = client.post(
            "/api/v1/datasets/upload-dataset",
            files={"file": ("test.txt", b"test content", "text/plain")}
        )
        assert response.status_code == 400
        assert "not allowed" in response.json()["detail"]
    
    def test_upload_dataset_no_file(self):
        """Test uploading without file"""
        response = client.post("/api/v1/datasets/upload-dataset")
        assert response.status_code == 422  # Validation error
    
    def test_preview_dataset_file_not_found(self):
        """Test previewing non-existent file"""
        response = client.get("/api/v1/datasets/preview-dataset?file_path=nonexistent.csv")
        assert response.status_code == 404


class TestModelAPI:
    """Test model upload and prediction endpoints"""
    
    def test_upload_model_invalid_file_type(self):
        """Test uploading invalid model file type"""
        response = client.post(
            "/api/v1/models/upload-model",
            files={"file": ("test.txt", b"test content", "text/plain")}
        )
        assert response.status_code == 400
        assert "not allowed" in response.json()["detail"]
    
    def test_predict_no_model_loaded(self):
        """Test prediction without loaded model"""
        response = client.post(
            "/api/v1/models/predict",
            json={"data": {"feature_1": 1.0, "feature_2": 2.0}}
        )
        # This should fail because no model is loaded
        assert response.status_code == 400


class TestMetricsAPI:
    """Test metrics evaluation endpoints"""
    
    def test_evaluate_metrics_classification(self):
        """Test classification metrics evaluation"""
        response = client.post(
            "/api/v1/metrics/evaluate",
            json={
                "y_true": [1, 0, 1, 0, 1],
                "y_pred": [1, 0, 1, 0, 0],
                "task_type": "classification"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["task_type"] == "classification"
        assert "accuracy" in data["metrics"]
        assert "precision" in data["metrics"]
        assert "recall" in data["metrics"]
        assert "f1_score" in data["metrics"]
    
    def test_evaluate_metrics_regression(self):
        """Test regression metrics evaluation"""
        response = client.post(
            "/api/v1/metrics/evaluate",
            json={
                "y_true": [1.0, 2.0, 3.0, 4.0, 5.0],
                "y_pred": [1.1, 1.9, 3.1, 3.9, 5.1],
                "task_type": "regression"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["task_type"] == "regression"
        assert "mse" in data["metrics"]
        assert "rmse" in data["metrics"]
        assert "mae" in data["metrics"]
        assert "r2_score" in data["metrics"]
    
    def test_evaluate_metrics_mismatched_lengths(self):
        """Test evaluation with mismatched array lengths"""
        response = client.post(
            "/api/v1/metrics/evaluate",
            json={
                "y_true": [1, 0, 1],
                "y_pred": [1, 0],
                "task_type": "classification"
            }
        )
        assert response.status_code == 400
        assert "same length" in response.json()["detail"]


class TestHealthEndpoints:
    """Test health and root endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "version" in data
    
    def test_health_endpoint(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "meovis-api"
