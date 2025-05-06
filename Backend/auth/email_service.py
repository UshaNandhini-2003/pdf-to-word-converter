import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Your email credentials (Use environment variables in production)
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_SENDER = "ushanandhininanjan@gmail.com"  # Replace with your email
EMAIL_PASSWORD = "reuj mcdc podp aids"  # Replace with your generated App Password

def send_otp_email(recipient_email, otp):
    subject = "Your OTP Code for Login"
    body = f"Hello,\n\nYour OTP code is: {otp}\n\nThis code is valid for 5 minutes.\n\nIf you did not request this, please ignore this email."

    # Create email message
    msg = MIMEMultipart()
    msg["From"] = EMAIL_SENDER
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        # Connect to SMTP server
        context = ssl.create_default_context()
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls(context=context)
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, recipient_email, msg.as_string())
        server.quit()

        print(f"OTP email sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
