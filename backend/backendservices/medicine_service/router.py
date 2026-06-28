from fastapi import APIRouter, Depends, HTTPException
from backendservices.auth_service.jwt_handler import get_current_user
from backendservices.medicine_service.models import MedicineRequest
from backendservices.medicine_service.service import lookup_medicine
from database import get_connection
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/medicine",
    tags=["Medicine Service"]
)

@router.post("/lookup")
async def medicine_lookup(data: MedicineRequest, current_user: dict = Depends(get_current_user)):
    try:
        logger.info(f"Medicine lookup: {data.medicine_name} by {current_user['email']}")
        result = await lookup_medicine(data.medicine_name)
        logger.info(f"Medicine lookup success: {data.medicine_name} source={result.get('source')}")
        return result
    except Exception as e:
        logger.exception("Medicine lookup error")
        raise HTTPException(status_code=500, detail=str(e))
        
@router.get("/local-database")
def get_local_medicines(current_user: dict = Depends(get_current_user)):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, medicine_name, category, uses, created_at FROM medicines ORDER BY created_at DESC")
        medicines = cursor.fetchall()
        conn.close()
        return {
            "total": len(medicines),
            "source": "Local SQLite Database",
            "medicines": [dict(m) for m in medicines]
        }
    except Exception as e:
        logger.error(f"Local DB error: {str(e)}")
        raise HTTPException(status_code=500, detail="Could not fetch local medicines!")