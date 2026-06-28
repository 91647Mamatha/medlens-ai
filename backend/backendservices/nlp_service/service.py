import json
import urllib3
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

def call_groq(prompt):
    http = urllib3.PoolManager()
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000
    }
    response = http.request(
        'POST', GROQ_URL,
        body=json.dumps(payload),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_API_KEY}'
        }
    )
    result = json.loads(response.data.decode('utf-8'))
    return result['choices'][0]['message']['content']

def extract_entities(report_id: str, extracted_text: str):
    prompt = f"""Extract all medical entities from this medical report text.
Return ONLY a JSON array with this exact format, nothing else:
[
  {{"text": "entity name", "category": "TEST_TREATMENT_PROCEDURE", "type": "TEST_NAME"}},
  {{"text": "entity name", "category": "MEDICAL_CONDITION", "type": "DX_NAME"}},
  {{"text": "entity name", "category": "ANATOMY", "type": "SYSTEM_ORGAN_SITE"}}
]

Categories must be one of:
- TEST_TREATMENT_PROCEDURE
- MEDICAL_CONDITION
- ANATOMY
- MEDICATION

Medical Report Text:
{extracted_text}

Return ONLY the JSON array, no explanation, no markdown."""

    response = call_groq(prompt)

    try:
        # Clean response and parse JSON
        clean = response.strip()
        if "```" in clean:
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        entities = json.loads(clean)
    except:
        entities = []

    return {
        "report_id": report_id,
        "total_entities": len(entities),
        "entities": entities
    }