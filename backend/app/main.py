from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Meovis API",
    description="Machine Learning Visualization Toolkit API",
    version="0.0.1",
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da spesifik origin'ler belirtin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Meovis API is running!"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "meovis-api"}


@app.get("/api/v1/status")
async def api_status():
    """API status"""
    return {"status": "active", "version": "0.0.1", "service": "meovis-api"}


@app.get("/favicon.ico")
async def favicon():
    """Favicon endpoint - returns no favicon message"""
    return {"message": "No favicon available"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
