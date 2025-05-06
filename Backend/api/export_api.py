from flask import Blueprint, request, send_file, jsonify
from config.database_config import get_db_connection
from auth.jwt_service import token_required
import os

export_api = Blueprint("export_api", __name__)

@export_api.route('/export', methods=['POST'])
@token_required
def export_file(decoded_token):
    data = request.json
    conversion_id = data.get("conversion_id")

    if not conversion_id:
        return jsonify({"error": "Missing conversion_id"}), 400

    db = get_db_connection()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT converted_file_path FROM conversions WHERE conversion_id = %s", (conversion_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Invalid conversion_id"}), 404

        file_path = result["converted_file_path"]

        if not os.path.exists(file_path):
            return jsonify({"error": "File not found on server"}), 404

        # Ensure it's a .docx file
        if not file_path.endswith(".docx"):
            return jsonify({"error": "Unsupported file format"}), 400

        return send_file(
            file_path,
            as_attachment=True,
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        db.close()
