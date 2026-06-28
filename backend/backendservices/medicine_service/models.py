from pydantic import BaseModel

class MedicineRequest(BaseModel):
    medicine_name: str

class MedicineResponse(BaseModel):
    medicine_name: str
    category: str
    uses: str
    side_effects: str
    interactions: str
    warnings: str
    disclaimer: str
    source: str