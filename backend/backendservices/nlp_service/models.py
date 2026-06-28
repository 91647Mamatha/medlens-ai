from pydantic import BaseModel
from typing import List

class NLPRequest(BaseModel):
    report_id: str
    extracted_text: str

class Entity(BaseModel):
    text: str
    category: str
    type: str

class NLPResponse(BaseModel):
    report_id: str
    total_entities: int
    entities: List[Entity]