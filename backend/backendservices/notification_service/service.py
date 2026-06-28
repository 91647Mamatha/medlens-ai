import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from database import (
    save_notification,
    get_notifications_by_user,
    mark_notification_read,
    get_unread_count
)

load_dotenv()

GMAIL_EMAIL = os.getenv('GMAIL_EMAIL')
GMAIL_PASSWORD = os.getenv('GMAIL_PASSWORD')

def send_email(to_email: str, subject: str, body: str):
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = GMAIL_EMAIL
        msg['To'] = to_email

        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #1A56A8;">🔬 MedLens AI</h1>
                    <p style="color: #666;">AI-Powered Medical Report Analysis</p>
                </div>
                <div style="background-color: #EBF5FB; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #1A56A8;">{subject}</h2>
                    <p style="color: #333; line-height: 1.6;">{body}</p>
                </div>
                <div style="text-align: center; color: #999; font-size: 12px;">
                    <p>MedLens AI — Smart. Accurate. Confidential.</p>
                </div>
            </div>
        </body>
        </html>
        """

        msg.attach(MIMEText(html_body, 'html'))

        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(GMAIL_EMAIL, GMAIL_PASSWORD)
        server.sendmail(GMAIL_EMAIL, to_email, msg.as_string())
        server.quit()

        return {"success": True, "message": f"Email sent to {to_email}"}

    except Exception as e:
        return {"success": False, "error": str(e)}

def notify_report_analyzed(user_email: str, report_id: str, file_name: str):
    title = "✅ Report Analysis Complete"
    message = f"Your medical report '{file_name}' has been successfully analyzed by MedLens AI. Report ID: {report_id}"

    # In-app notification
    save_notification(user_email, title, message, "report_analyzed")

    # Email notification
    email_result = send_email(
        user_email,
        title,
        f"""Your medical report has been successfully analyzed!

📋 Report: {file_name}
🔑 Report ID: {report_id}

You can now view your:
✅ Extracted Text
✅ Medical Entities
✅ AI Summary
✅ Health Tips
✅ Recommendations

Login to MedLens AI to view your complete report analysis."""
    )

    return {
        "inapp": "Notification saved",
        "email": email_result
    }

def notify_abnormal_values(user_email: str, report_id: str, abnormal_values: str):
    title = "⚠️ Abnormal Values Detected"
    message = f"Abnormal values found in your report. Please consult your doctor. Report ID: {report_id}"

    # In-app notification
    save_notification(user_email, title, message, "abnormal_values")

    # Email notification
    email_result = send_email(
        user_email,
        title,
        f"""⚠️ Abnormal values were detected in your medical report!

Report ID: {report_id}

Abnormal Findings:
{abnormal_values}

⚕️ Please consult your doctor for proper medical advice.
Do not self-medicate based on these results."""
    )

    return {
        "inapp": "Notification saved",
        "email": email_result
    }

def get_my_notifications(user_email: str):
    notifications = get_notifications_by_user(user_email)
    unread = get_unread_count(user_email)
    return {
        "total": len(notifications),
        "unread": unread,
        "notifications": notifications
    }

def read_notification(notification_id: int):
    mark_notification_read(notification_id)
    return {"message": "Notification marked as read"}