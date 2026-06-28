import sqlite3
import json

DB_FILE = "medlens.db"


def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'patient',
            created_at TEXT NOT NULL
        )
    ''')

    # Uploads table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id TEXT UNIQUE NOT NULL,
            file_key TEXT NOT NULL,
            file_name TEXT NOT NULL,
            file_type TEXT NOT NULL,
            file_size TEXT NOT NULL,
            uploaded_by TEXT NOT NULL,
            role TEXT NOT NULL,
            uploaded_at TEXT NOT NULL
        )
    ''')

    # History table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id TEXT UNIQUE NOT NULL,
            file_name TEXT NOT NULL,
            extracted_text TEXT,
            entities TEXT,
            patient_summary TEXT,
            doctor_summary TEXT,
            abnormal_values TEXT,
            health_tips TEXT,
            recommendations TEXT,
            saved_by TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    # Chat history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            report_id TEXT NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            asked_by TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_email TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
    )
''')
        # Medicines table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            medicine_name TEXT UNIQUE NOT NULL,
            category TEXT,
            uses TEXT,
            side_effects TEXT,
            interactions TEXT,
            warnings TEXT,
            wiki_summary TEXT,
            created_at TEXT NOT NULL
        )
    ''') 

    conn.commit()
    conn.close()


# ─── Users ────────────────────────────

def get_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None


def save_user(full_name, email, password, role):
    from datetime import datetime

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (full_name, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)",
        (full_name, email, password, role, datetime.now().isoformat())
    )

    conn.commit()
    conn.close()


# ─── Uploads ──────────────────────────

def save_upload(report_id, file_key, file_name, file_type,
                file_size, uploaded_by, role):

    from datetime import datetime

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO uploads (report_id, file_key, file_name, file_type, file_size, uploaded_by, role, uploaded_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (
            report_id,
            file_key,
            file_name,
            file_type,
            file_size,
            uploaded_by,
            role,
            datetime.now().isoformat()
        )
    )

    conn.commit()
    conn.close()


def get_uploads_by_user(email: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM uploads WHERE uploaded_by = ?",
        (email,)
    )

    uploads = cursor.fetchall()

    conn.close()

    return [dict(u) for u in uploads]


# ─── History ──────────────────────────

def save_report_history(
    report_id,
    file_name,
    extracted_text,
    entities,
    patient_summary,
    doctor_summary,
    abnormal_values,
    health_tips,
    recommendations,
    saved_by
):
    from datetime import datetime

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT OR IGNORE INTO history
        (
            report_id,
            file_name,
            extracted_text,
            entities,
            patient_summary,
            doctor_summary,
            abnormal_values,
            health_tips,
            recommendations,
            saved_by,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''',
        (
            report_id,
            file_name,
            extracted_text,
            json.dumps(entities),
            patient_summary,
            doctor_summary,
            abnormal_values,
            health_tips,
            recommendations,
            saved_by,
            datetime.now().isoformat()
        )
    )

    conn.commit()
    conn.close()


def get_history_by_user(email: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM history WHERE saved_by = ?",
        (email,)
    )

    reports = cursor.fetchall()

    conn.close()

    return [dict(r) for r in reports]


def get_history_by_id(report_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM history WHERE report_id = ?",
        (report_id,)
    )

    report = cursor.fetchone()

    conn.close()

    return dict(report) if report else None


def delete_history(report_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM history WHERE report_id = ?",
        (report_id,)
    )

    conn.commit()
    conn.close()


# ─── Chat History ─────────────────────

def save_chat(report_id, question, answer, asked_by):
    from datetime import datetime

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO chat_history (report_id, question, answer, asked_by, created_at) VALUES (?, ?, ?, ?, ?)",
        (
            report_id,
            question,
            answer,
            asked_by,
            datetime.now().isoformat()
        )
    )

    conn.commit()
    conn.close()


def get_chat_by_report(report_id: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM chat_history WHERE report_id = ?",
        (report_id,)
    )

    chats = cursor.fetchall()

    conn.close()

    return [dict(c) for c in chats]


# ─── Knowledge Base ───────────────────

def get_answer_from_db(question: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM knowledge_base WHERE LOWER(question)=LOWER(?)",
        (question,)
    )

    result = cursor.fetchone()

    conn.close()

    return dict(result) if result else None


def save_answer_to_db(question: str, answer: str, source: str):
    from datetime import datetime

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT OR IGNORE INTO knowledge_base
        (question, answer, source, created_at)
        VALUES (?, ?, ?, ?)
        ''',
        (
            question,
            answer,
            source,
            datetime.now().isoformat()
        )
    )

    conn.commit()
    conn.close()


def get_all_knowledge():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM knowledge_base ORDER BY created_at DESC"
    )

    rows = cursor.fetchall()

    conn.close()

    return [dict(r) for r in rows]

 # ─── Medicines ────────────────────────

def get_medicine_by_name(medicine_name: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM medicines WHERE LOWER(medicine_name)=LOWER(?)",
        (medicine_name,)
    )

    medicine = cursor.fetchone()

    conn.close()

    return dict(medicine) if medicine else None


def save_medicine(
    medicine_name,
    category,
    uses,
    side_effects,
    interactions,
    warnings,
    wiki_summary
):
    from datetime import datetime

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        '''
        INSERT OR IGNORE INTO medicines
        (
            medicine_name,
            category,
            uses,
            side_effects,
            interactions,
            warnings,
            wiki_summary,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''',
        (
            medicine_name,
            category,
            uses,
            side_effects,
            interactions,
            warnings,
            wiki_summary,
            datetime.now().isoformat()
        )
    )

    conn.commit()
    conn.close()   

def prepopulate_medicines():
    common_medicines = [
        ("Paracetamol", "Analgesic/Antipyretic", "Fever and pain relief", "Nausea, liver damage (overdose)", "Warfarin, alcohol", "Do not exceed 4g/day"),
        ("Aspirin", "NSAID/Antiplatelet", "Pain, fever, blood clot prevention", "Stomach bleeding, ulcers", "Warfarin, ibuprofen", "Avoid in children under 16"),
        ("Metformin", "Antidiabetic", "Type 2 diabetes management", "Nausea, diarrhea, lactic acidosis", "Alcohol, contrast dye", "Monitor kidney function regularly"),
        ("Amoxicillin", "Antibiotic", "Bacterial infections", "Diarrhea, rash, allergic reaction", "Warfarin, methotrexate", "Complete full course"),
        ("Omeprazole", "Proton Pump Inhibitor", "Acid reflux, stomach ulcers", "Headache, nausea, diarrhea", "Clopidogrel, methotrexate", "Take 30 mins before food"),
        ("Atorvastatin", "Statin", "High cholesterol", "Muscle pain, liver problems", "Gemfibrozil, niacin", "Avoid grapefruit juice"),
        ("Ibuprofen", "NSAID", "Pain, fever, inflammation", "Stomach upset, kidney issues", "Aspirin, blood thinners", "Take with food"),
        ("Cetirizine", "Antihistamine", "Allergies, hay fever", "Drowsiness, dry mouth", "Alcohol, sedatives", "Avoid driving"),
        ("Azithromycin", "Antibiotic", "Respiratory infections, STIs", "Nausea, diarrhea, heart rhythm", "Antacids, warfarin", "Take on empty stomach"),
        ("Pantoprazole", "Proton Pump Inhibitor", "GERD, stomach ulcers", "Headache, diarrhea", "Methotrexate, warfarin", "Take before meals"),
    ]

    from datetime import datetime
    conn = get_connection()
    cursor = conn.cursor()

    for med in common_medicines:
        cursor.execute(
            '''INSERT OR IGNORE INTO medicines 
            (medicine_name, category, uses, side_effects, interactions, warnings, wiki_summary, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
            (*med, "", datetime.now().isoformat())
        )

    conn.commit()
    conn.close()

# ─── Notifications ────────────────────

def save_notification(user_email, title, message, type):
    from datetime import datetime
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO notifications (user_email, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, ?)",
        (user_email, title, message, type, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()

def get_notifications_by_user(user_email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM notifications WHERE user_email = ? ORDER BY created_at DESC",
        (user_email,)
    )
    notifications = cursor.fetchall()
    conn.close()
    return [dict(n) for n in notifications]

def mark_notification_read(notification_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE notifications SET is_read = 1 WHERE id = ?",
        (notification_id,)
    )
    conn.commit()
    conn.close()

def get_unread_count(user_email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT COUNT(*) as count FROM notifications WHERE user_email = ? AND is_read = 0",
        (user_email,)
    )
    result = cursor.fetchone()
    conn.close()
    return dict(result)["count"]