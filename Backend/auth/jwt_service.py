import jwt
import datetime
from functools import wraps  # ✅ Import wraps
from flask import request, jsonify

SECRET_KEY = "your_secret_key"

def generate_jwt_token(user_id, role):
    payload = {
        "sub": str(user_id),  # ✅ Convert user_id to string
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")



def verify_jwt_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token or not token.startswith("Bearer "):
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            token = token.split(" ")[1]  # Extract the token
            decoded_token = verify_jwt_token(token)
            if not decoded_token:
                return jsonify({"error": "Token is invalid or expired"}), 401
        except Exception as e:
            return jsonify({"error": str(e)}), 401
        
        return f(decoded_token, *args, **kwargs)  # Pass decoded token (user info)
    
    return decorated