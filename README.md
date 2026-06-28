# 🩺 MedLens AI – Intelligent Medical Report Analysis and Health Assistance System

MedLens AI is an AI-powered healthcare platform that helps patients and doctors understand medical reports through automated report analysis, AI-generated summaries, trend analysis, medicine lookup, and an intelligent health assistant.

The system enables users to upload medical reports in PDF or image format, extract medical information, generate patient-friendly and doctor-oriented summaries, track health trends over time, and obtain medicine information through a FastMCP-powered knowledge retrieval system.

---

## 🚀 Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Role-based access control
* Patient and Doctor roles
* Secure API access using Bearer Tokens

### 📄 Medical Report Upload

* Upload PDF and image reports
* File validation and storage
* Report metadata management

### 🔍 Medical Report Extraction

* OCR-based text extraction
* PDF processing using PyMuPDF
* Image processing using Pytesseract

### 🧠 AI-Powered Report Analysis

* Medical entity extraction
* Patient-friendly summaries
* Doctor-oriented clinical summaries
* Abnormal value detection
* Health recommendations

### 📚 Report History

* Store processed reports
* Access previous analyses
* Retrieve historical medical information

### 📈 Health Trend Analysis

* Compare multiple reports
* Track health changes over time
* Visualize trends using charts

### 💬 AI Health Assistant

* Report-based question answering
* General health queries
* Interactive healthcare chatbot

### 💊 Medicine Lookup Service

* Local SQLite medicine database
* Cache-first medicine retrieval
* FastMCP-based Wikipedia integration
* Drug uses, side effects, interactions, and warnings

### 🔔 Notification Service

* Analysis notifications
* Health alerts
* Read/unread notification tracking

---

# 🏗️ System Architecture

```text
Frontend (React + Tailwind CSS)
                    ↓
               FastAPI Backend
                    ↓
 ┌──────────────────────────────────────┐
 │                                      │
 ▼                                      ▼
Authentication Service          Upload Service
                                        │
                                        ▼
                              Extraction Service
                                        │
                                        ▼
                                  NLP Service
                                        │
                                        ▼
                               Summary Service
                                        │
                                        ▼
                                History Service
                                        │
                                        ▼
                              Trend Analysis
                                        │
                                        ▼
                               Chat Service
                                        │
                                        ▼
                          Medicine Lookup Service
                                        │
                      ┌─────────────────┴─────────────────┐
                      ▼                                   ▼
                SQLite Database                   Wikipedia MCP
                                                        │
                                                        ▼
                                                  Groq LLM
```

---

# 🛠️ Backend Technology Stack

| Technology    | Purpose                      |
| ------------- | ---------------------------- |
| FastAPI       | Backend Framework            |
| Python        | Programming Language         |
| SQLite        | Database                     |
| JWT           | Authentication               |
| PyMuPDF       | PDF Processing               |
| Pytesseract   | OCR                          |
| Groq LLM      | AI Processing                |
| FastMCP       | MCP Framework                |
| Wikipedia MCP | External Knowledge Retrieval |
| Uvicorn       | ASGI Server                  |
| Swagger UI    | API Testing                  |

---

# 🎨 Frontend Technology Stack

| Technology   | Purpose            |
| ------------ | ------------------ |
| React.js 19  | Frontend Framework |
| Vite         | Build Tool         |
| Tailwind CSS | Styling            |
| Axios        | API Communication  |
| Recharts     | Data Visualization |
| Lucide React | Icons              |

---

# 🗄️ Database Tables

* Users
* Uploads
* Report History
* Chat History
* Medicines
* Notifications

---

# 👥 User Roles

## Patient

* Upload medical reports
* View report summaries
* Track health trends
* Use AI Health Assistant
* Search medicine information

## Doctor

* Review patient reports
* Access clinical summaries
* Analyze abnormal values
* View historical records

---

# 🤖 FastMCP Integration

The Medicine Lookup Service follows a cache-first architecture:

```text
User Search
     ↓
SQLite Database
     ↓ Found
Return Result

     ↓ Not Found
Wikipedia MCP Server
     ↓
Wikipedia Knowledge
     ↓
Groq LLM Processing
     ↓
Save to SQLite
     ↓
Return Structured Response
```

This approach improves performance by caching medicine information locally after the first retrieval.

---

# 📁 Project Structure

```text
medlens-ai/
│
├── backend/
│   ├── backendservices/
│   │   ├── auth_service/
│   │   ├── upload_service/
│   │   ├── extraction_service/
│   │   ├── nlp_service/
│   │   ├── summary_service/
│   │   ├── history_service/
│   │   ├── trend_service/
│   │   ├── chat_service/
│   │   ├── medicine_service/
│   │   └── notification_service/
│   ├── database.py
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
└── README.md
```

---

#  Testing Tools

* Swagger UI
* Postman
* Browser-based Testing
* End-to-End Integration Testing

