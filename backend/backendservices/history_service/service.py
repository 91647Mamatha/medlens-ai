from database import save_report_history, get_history_by_user, get_history_by_id, delete_history
from backendservices.upload_service.service import get_file_by_id
from backendservices.extraction_service.service import extract_text
from backendservices.nlp_service.service import extract_entities
from backendservices.summary_service.service import generate_summary
from backendservices.notification_service.service import (
    notify_report_analyzed,
    notify_abnormal_values
)

def save_full_report(report_id: str, user_email: str):
    # Check already saved
    existing = get_history_by_id(report_id)
    if existing:
        return {"message": "Report already saved!", "report_id": report_id}

    # Step 1: Get file info
    file_info = get_file_by_id(report_id)
    if not file_info:
        return {"error": "Report not found! Please upload first."}

    # Step 2: Extract text
    extraction = extract_text(report_id)
    if "error" in extraction:
        return extraction
    extracted_text = extraction["extracted_text"]

    # Step 3: Get entities

    print("TEXT LENGTH:", len(extracted_text))
    print(extracted_text[:200])
    nlp_result = extract_entities(report_id, extracted_text)
    print("NLP RESULT:", nlp_result)
    entities = nlp_result["entities"]
    # Step 4: Generate summary
    summary_result = generate_summary(report_id, extracted_text)

    # Step 5: Save everything
    save_report_history(
        report_id,
        file_info["file_name"],
        extracted_text,
        entities,
        summary_result.get("patient_summary", ""),
        summary_result.get("doctor_summary", ""),
        summary_result.get("abnormal_values", ""),
        summary_result.get("health_tips", ""),
        summary_result.get("recommendations", ""),
        user_email
    )

    # Step 6: Trigger notifications
    notify_report_analyzed(user_email, report_id, file_info["file_name"])

    if summary_result.get("abnormal_values"):
        notify_abnormal_values(
            user_email,
            report_id,
            summary_result.get("abnormal_values", "")
        )

    return {
        "message": "Report saved successfully!",
        "report_id": report_id,
        "file_name": file_info["file_name"],
        "patient_summary": summary_result.get("patient_summary", ""),
        "abnormal_values": summary_result.get("abnormal_values", ""),
        "health_tips": summary_result.get("health_tips", "")
    }

def get_all_reports(user_email):
    reports = get_history_by_user(user_email)
    return {"total": len(reports), "reports": reports}

def get_report_by_id(report_id):
    report = get_history_by_id(report_id)
    if not report:
        return {"error": f"Report '{report_id}' not found!"}
    return report

def delete_report(report_id, user_email):
    report = get_history_by_id(report_id)
    if report and report["saved_by"] == user_email:
        delete_history(report_id)
        return {"message": "Report deleted successfully!"}
    return {"error": "Report not found!"}