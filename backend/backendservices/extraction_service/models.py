from pydantic import BaseModel

class ExtractionRequest(BaseModel):
    report_id: str

class ExtractionResponse(BaseModel):
    report_id: str
    file_name: str
    file_type: str
    extracted_text: str