import json
import urllib3
import os
from dotenv import load_dotenv
from database import get_history_by_user

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

def call_groq(prompt):
    http = urllib3.PoolManager()
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1500
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

def analyze_trend(user_email: str):

    # Get all reports for this user
    reports = get_history_by_user(user_email)

    if len(reports) == 0:
        return {
            "error": "No reports found!",
            "message": "Please upload and save at least 1 report first."
        }

    if len(reports) == 1:
        return {
            "total_reports": 1,
            "message": "Only 1 report found. Upload more reports to see health trends!",
            "current_summary": reports[0].get("patient_summary", "")
        }

    # Build report summaries for Groq
    reports_text = ""
    for i, report in enumerate(reports, 1):
        reports_text += f"""
Report {i} — {report.get('created_at', '')[:10]}
File: {report.get('file_name', '')}
Extracted Data: {report.get('extracted_text', '')[:500]}
Abnormal Values: {report.get('abnormal_values', '')}
---"""

    prompt = f"""You are a medical health trend analyst.
Analyze these {len(reports)} medical reports from the same patient over time and identify health trends.

{reports_text}

Return ONLY a JSON object with this exact format:
{{
  "total_reports": {len(reports)},
  "period": "date range of reports",
  "parameter_trends": [
    {{
      "parameter": "Hemoglobin",
      "values": ["10 g/dl", "11 g/dl", "12 g/dl"],
      "trend": "Improving",
      "status": "📈",
      "interpretation": "Hemoglobin levels are steadily improving"
    }},
    {{
      "parameter": "Platelet Count",
      "values": ["4.1", "3.8", "3.2"],
      "trend": "Declining",
      "status": "📉",
      "interpretation": "Platelet count is decreasing — consult doctor"
    }}
  ],
  "overall_health_trend": "Overall health is improving based on recent reports",
  "recommendations": "Specific recommendations based on trends",
  "alert": "Any urgent concerns that need immediate attention"
}}

Return ONLY JSON, no explanation, no markdown."""

    response = call_groq(prompt)

    try:
        clean = response.strip()
        if "```" in clean:
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        result = json.loads(clean)
        return result
    except:
        return {
            "total_reports": len(reports),
            "overall_health_trend": response,
            "parameter_trends": []
        }