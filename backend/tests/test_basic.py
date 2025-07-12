import pytest
from fastapi.testclient import TestClient

# Bu dosya şimdilik boş bırakılıyor çünkü henüz main.py dosyası yok
# Ana uygulama dosyası oluşturulduğunda buraya testler eklenecek

def test_basic():
    """Temel test fonksiyonu"""
    assert True

def test_imports():
    """Gerekli kütüphanelerin import edilebilir olduğunu test eder"""
    try:
        import fastapi
        import uvicorn
        import pandas
        import numpy
        import sklearn
        assert True
    except ImportError as e:
        pytest.fail(f"Import hatası: {e}")

def test_app_creation():
    """FastAPI uygulamasının oluşturulabildiğini test eder"""
    from app.main import app
    assert app is not None

def test_health_check():
    """Health check endpoint'inin çalıştığını test eder"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_root_endpoint():
    """Root endpoint'inin çalıştığını test eder"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_api_status():
    """API status endpoint'inin çalıştığını test eder"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/api/v1/status")
    assert response.status_code == 200
    assert response.json()["status"] == "active"

def test_favicon():
    """Favicon endpoint'inin çalıştığını test eder"""
    from app.main import app
    client = TestClient(app)
    response = client.get("/favicon.ico")
    assert response.status_code == 200
    assert "message" in response.json() 