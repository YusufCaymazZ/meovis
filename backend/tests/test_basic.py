import pytest
from fastapi.testclient import TestClient

# Basic test file for the FastAPI application

def test_basic():
    """Basic test function"""
    assert True

def test_imports():
    """Tests that required libraries can be imported"""
    try:
        import fastapi
        import uvicorn
        import pandas
        import numpy
        import sklearn
        assert True
    except ImportError as e:
        pytest.fail(f"Import error: {e}")

def test_app_creation():
    """Tests that FastAPI application can be created"""
    from app.main import app
    assert app is not None

def test_health_check():
    """Tests that health check endpoint works"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root_endpoint():
    """Tests that root endpoint works"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "Meovis API is running!"

def test_api_status():
    """Tests that API status endpoint works"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    assert response.json()["status"] == "active"

def test_favicon():
    """Tests that favicon endpoint works"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/favicon.ico")
    assert response.status_code == 200
    assert "message" in response.json() 