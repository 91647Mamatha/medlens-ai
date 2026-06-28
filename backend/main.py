from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from database import init_db, prepopulate_medicines
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('medlens.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

from backendservices.auth_service.router import router as auth_router
from backendservices.upload_service.router import router as upload_router
from backendservices.extraction_service import router as extraction_router
from backendservices.nlp_service import router as nlp_router
from backendservices.summary_service import router as summary_router
from backendservices.chat_service import router as chat_router
from backendservices.history_service import router as history_router
from backendservices.medicine_service import router as medicine_router
from backendservices.notification_service import router as notification_router
from backendservices.trend_service import router as trend_router

app = FastAPI(
    title="MediLens AI Backend",
    version="1.0.0"
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Something went wrong!",
            "detail": str(exc)
        }
    )

# 404 handler
@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=404,
        content={
            "error": True,
            "message": "Resource not found!"
        }
    )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()
prepopulate_medicines()
logger.info("MediLens AI Backend Started!")

app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(extraction_router)
app.include_router(nlp_router)
app.include_router(summary_router)
app.include_router(chat_router)
app.include_router(history_router)
app.include_router(medicine_router)
app.include_router(notification_router)
app.include_router(trend_router)

@app.get("/")
def home():
    logger.info("Home endpoint called")
    return {"message": "MediLens AI Backend Running"}