from pydantic import BaseModel

class SummaryRequest(BaseModel):
    report_id: str
    extracted_text: str

class SummaryResponse(BaseModel):
    report_id: str
    patient_summary: str = None
    health_tips: str = None
    recommendations: str = None
    doctor_summary: str = None
    abnormal_values: str = None