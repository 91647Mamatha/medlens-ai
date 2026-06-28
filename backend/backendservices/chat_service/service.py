import json
import urllib3
import os
from dotenv import load_dotenv
from database import save_chat

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'


def call_groq(messages):
    http = urllib3.PoolManager()
    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages,
        "max_tokens": 800
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


def detect_mode(question: str, report_text: str):
    question_lower = question.lower()

    report_keywords = [
        "my report", "my result", "my test",
        "my hemoglobin", "my platelet", "my wbc",
        "abnormal values", "explain my report",
        "is my report normal", "is my", "what are my"
    ]

    assistant_keywords = [
        "help", "guide", "what should i do", "what next",
        "how do i", "how does", "how to", "where can i",
        "what can i do", "how to upload", "how to view",
        "how to check", "what is medilens", "features",
        "how can i", "where is", "what can this app"
    ]

    if any(k in question_lower for k in assistant_keywords):
        return "medilens"
    elif report_text and any(k in question_lower for k in report_keywords):
        return "report"
    else:
        return "general"


def chat(question: str, report_text: str, report_id: str, user_email: str):

    mode = detect_mode(question, report_text)
    answer = ""
    source = ""

    # ─── Mode 1: Report Q&A ───────────────
    if mode == "report" and report_text:
        messages = [
            {
                "role": "system",
                "content": f"""You are an AI Health Assistant helping a patient understand their medical report.
Answer in simple, clear, friendly language.
Always be encouraging and supportive.
Do not mention medicines or dosage.
If asked about medicine, say: Please use the Medicine Lookup feature.

Medical Report:
{report_text}"""
            },
            {"role": "user", "content": question}
        ]
        answer = call_groq(messages)
        source = "Report Analysis"

    # ─── Mode 2: MediLens Assistant ───────
    elif mode == "medilens":
        messages = [
            {
                "role": "system",
                "content": """You are MediLens AI — a friendly guide helping users navigate the MediLens AI application.

ABOUT MEDILENS AI:
MediLens AI is an AI-powered medical report analysis application.

FEATURES AVAILABLE:
1. Upload Report — Upload PDF, PNG, JPG medical reports for AI analysis
2. AI Summary — Get patient-friendly or doctor-friendly summary of your report
3. Report History — View all your past uploaded and analyzed reports
4. AI Assistant — Ask questions about your report or general health
5. Medicine Lookup — Search any medicine for uses, side effects, warnings
6. Health Trends — Track your health parameters over multiple reports
7. Notifications — Get alerts when report is analyzed or abnormal values detected

HOW TO GET STARTED:
- Register and login first
- Click Upload Report button to upload your medical document (PDF, PNG, JPG)
- Your report is automatically analyzed by AI
- Go to Report History to view your analyzed reports
- Use AI Assistant to ask questions
- Use Medicine Lookup to search medicine information
- Use Health Trends to see health changes over time

ROLES:
- Patient — sees patient-friendly summary and health tips
- Doctor — sees clinical summary and abnormal values

Answer the user's question about MediLens AI in a short, friendly, helpful way."""
            },
            {"role": "user", "content": question}
        ]
        answer = call_groq(messages)
        source = "MediLens Assistant"

    # ─── Mode 3: General Health Q&A ───────
    else:
        messages = [
            {
                "role": "system",
                "content": """You are an AI Health Assistant.
Answer general health questions in simple, clear, friendly language.
Do not give specific medicine dosage or prescriptions.
If asked about a specific medicine, say: Please use the Medicine Lookup feature for medicine information.
Always recommend consulting a doctor for medical decisions."""
            },
            {"role": "user", "content": question}
        ]
        answer = call_groq(messages)
        source = "Groq LLM"

    # Save chat history
    if report_id:
        save_chat(report_id, question, answer, user_email)

    return {
        "question": question,
        "answer": answer,
        "mode": mode,
        "source": source
    }


def chat_with_report(report_id, report_text, question, user_email):
    return chat(
        question=question,
        report_text=report_text,
        report_id=report_id,
        user_email=user_email
    )


def get_chat_history_by_report(report_id: str):
    from database import get_chat_by_report
    chats = get_chat_by_report(report_id)
    return {
        "report_id": report_id,
        "total": len(chats),
        "history": chats
    }