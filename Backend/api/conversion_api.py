import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF
from docx import Document
from auth.jwt_service import token_required
from config.database_config import get_db_connection

convert_bp = Blueprint("convert", __name__)

# ✅ Directory to store converted files
CONVERTED_FILES_DIR = "converted_files"
os.makedirs(CONVERTED_FILES_DIR, exist_ok=True)

@convert_bp.route("/convert", methods=["POST"])
@token_required
def convert_file(decoded_token):
    user_id = decoded_token.get("sub")

    data = request.json
    file_id = data.get("file_id")
    output_format = data.get("output_format")  # Expected: "DOCX"

    if not file_id or output_format != "DOCX":
        return jsonify({"error": "Invalid file_id or unsupported output format"}), 400

    # ✅ Fetch the PDF file path from the database
    db_connection = get_db_connection()
    cursor = db_connection.cursor(dictionary=True)
    cursor.execute("SELECT pdf_content FROM pdf_files WHERE file_id = %s", (file_id,))
    file_record = cursor.fetchone()

    if not file_record:
        return jsonify({"error": "PDF file not found"}), 404

    pdf_binary_data = file_record["pdf_content"]

    # Log the raw pdf_binary_data for debugging
    print(f"Raw pdf_binary_data type: {type(pdf_binary_data)}")
    print(f"PDF binary data length: {len(pdf_binary_data)} bytes")

    # ✅ Ensure that pdf_binary_data is in bytes format (it should be already)
    try:
        if isinstance(pdf_binary_data, str):
            # If it's a string, we should log an error since it shouldn't be a string
            raise ValueError("PDF data should not be a string. It should be in binary format.")
        elif isinstance(pdf_binary_data, bytes):
            print("PDF binary data is in bytes format, proceeding.")
        else:
            raise ValueError("PDF data is neither a valid base64 string nor bytes.")
    except Exception as e:
        return jsonify({"error": f"Invalid PDF data format: {str(e)}"}), 400

    try:
        # ✅ Write the binary PDF data to a temporary file
        with open("temp_pdf.pdf", "wb") as temp_pdf:
            temp_pdf.write(pdf_binary_data)

        # ✅ Construct DOCX output path
        docx_filename = f"file_{file_id}.docx"
        docx_path = os.path.join(CONVERTED_FILES_DIR, docx_filename)

        # ✅ Perform the conversion
        convert_pdf_to_docx_file("temp_pdf.pdf", docx_path)

        # ✅ Insert into `conversions` table
        cursor.execute("""
            INSERT INTO conversions (file_id, user_id, input_format, output_format, status, converted_file_path)
            VALUES (%s, %s, %s, %s, 'Completed', %s)
        """, (file_id, user_id, "PDF", "DOCX", docx_path))

        db_connection.commit()
        conversion_id = cursor.lastrowid

        cursor.close()
        db_connection.close()

        return jsonify({"message": "PDF successfully converted to DOCX", "conversion_id": conversion_id})

    except Exception as e:
        print(f"Error during conversion: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ✅ Helper function to convert PDF to DOCX using PyMuPDF + python-docx
def convert_pdf_to_docx_file(pdf_path, docx_path):
    doc = fitz.open(pdf_path)
    document = Document()

    for page in doc:
        text = page.get_text()
        if text.strip():  # Avoid adding empty pages
            document.add_paragraph(text)

    document.save(docx_path)
