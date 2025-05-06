import bcrypt
import jwt
import datetime
from config.database_config import get_db_connection

SECRET_KEY = "your_secret_key"

def register_user(username, email, password):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Hash Password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", 
                       (username, email, hashed_password))
        conn.commit()
        return {"message": "User registered successfully"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()


import random
from datetime import datetime, timedelta
from auth.jwt_service import generate_jwt_token
from auth.email_service import send_otp_email
def login_user(email, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return {"error": "Invalid credentials"}

    # Generate OTP
    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.now() + timedelta(minutes=5)

    cursor.execute("UPDATE users SET otp_code=%s, otp_expiry=%s WHERE email=%s", (otp, otp_expiry, email))
    conn.commit()

    # Send OTP via email
    if send_otp_email(email, otp):
        return {"message": "OTP sent. Please verify to continue"}
    else:
        return {"error": "Failed to send OTP. Please try again later"}

def verify_otp(email, otp):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or user['otp_code'] != otp or datetime.now() > user['otp_expiry']:
            return {"error": "Invalid or expired OTP"}

        # Generate JWT Token
        token = generate_jwt_token(user['user_id'], user['role'])

        # Update last login
        cursor.execute("UPDATE users SET last_login = %s WHERE email = %s", (datetime.now(), email))
        conn.commit()

        return {"message": "Login successful", "token": token}
    except Exception as e:
        return {"error": str(e)}
    finally:
        cursor.close()
        conn.close()