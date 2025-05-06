from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from config.database_config import get_db_connection  # Use your existing DB connection
from auth.jwt_service import token_required

upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ✅ Allow only PDF files
ALLOWED_EXTENSIONS = {"pdf"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route("/upload", methods=["POST"])
@token_required
def upload_file(decoded_token):
    user_id = decoded_token.get("sub")
    
    if not user_id:
        return jsonify({"error": "User ID missing in token"}), 401

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format. Only PDF allowed."}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)  # Save file locally

    file_size = os.path.getsize(file_path)

    try:
        with open(file_path, "rb") as f:
            binary_data = f.read()  # Read as binary

        conn = get_db_connection()
        cursor = conn.cursor()

        # ✅ Update table name/column if needed
        cursor.execute(
            "INSERT INTO pdf_files (user_id, file_name, file_size, pdf_content) VALUES (%s, %s, %s, %s)",
            (user_id, filename, file_size, binary_data),
        )
        
        file_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "PDF uploaded successfully", "file_id": file_id}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
