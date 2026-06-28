import json
import urllib3
import os
from dotenv import load_dotenv
from database import get_history_by_id

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'


def call_groq(prompt):
    http = urllib3.PoolManager()

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "max_tokens": 1500
    }

    response = http.request(
        'POST',
        GROQ_URL,
        body=json.dumps(payload),
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {GROQ_API_KEY}'
        }
    )

    result = json.loads(response.data.decode('utf-8'))

    return result['choices'][0]['message']['content']


def generate_summary(report_id: str, extracted_text: str):

    # STEP 1: CHECK LOCAL DATABASE FIRST

    existing = get_history_by_id(report_id)

    if existing:
        return {
            "report_id": report_id,
            "patient_summary": existing.get("patient_summary", ""),
            "health_tips": existing.get("health_tips", ""),
            "recommendations": existing.get("recommendations", ""),
            "doctor_summary": existing.get("doctor_summary", ""),
            "abnormal_values": existing.get("abnormal_values", ""),
            "source": "Local Database"
        }
       

    # STEP 2: GENERATE USING GROQ

    prompt = f"""
You are a medical report summarizer.

Analyze this medical report and return ONLY a JSON object with this exact format:

{{
  "patient_summary": "Simple friendly language for patient. Easy to understand. No medical jargon.",
  "health_tips": "Specific practical tips - foods to eat, exercises, sleep, lifestyle changes.",
  "recommendations": "When to visit doctor, what to monitor, follow up tests needed",
  "doctor_summary": "Clinical language summary for doctor with medical terminology",
  "abnormal_values": "List all abnormal values with actual vs normal range"
}}

Medical Report:

{extracted_text}

Return ONLY the JSON object.
"""

    response = call_groq(prompt)

    try:

        clean = response.strip()

        if "```" in clean:
            clean = clean.split("```")[1]

            if clean.startswith("json"):
                clean = clean[4:]

        result = json.loads(clean)

    except:

        result = {
            "patient_summary": response,
            "health_tips": "",
            "recommendations": "",
            "doctor_summary": "",
            "abnormal_values": ""
        }

    return {
        "report_id": report_id,
        **result,
        "source": "Groq"
    }