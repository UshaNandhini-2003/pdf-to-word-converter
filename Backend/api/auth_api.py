from flask import Blueprint, request, jsonify
from auth.auth_service import register_user, login_user, verify_otp

auth_blueprint = Blueprint('auth_api', __name__)  # Define Blueprint

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    return jsonify(register_user(data['username'], data['email'], data['password']))

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    return jsonify(login_user(data['email'], data['password']))

@auth_blueprint.route('/verify-otp', methods=['POST'])
def verify():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 415  # Unsupported Media Type

        data = request.get_json()

        if not data:
            return jsonify({"error": "Empty request body"}), 400  # Bad Request

        email = data.get("email")
        otp = data.get("otp")

        if not email or not otp:
            return jsonify({"error": "Email and OTP are required"}), 400  # Bad Request

        return jsonify(verify_otp(email, otp))
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # Internal Server Error