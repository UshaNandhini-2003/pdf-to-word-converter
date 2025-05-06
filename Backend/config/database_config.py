import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env file

def get_db_connection():
    """Establish a database connection to Railway MySQL."""
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="pdf to word converter"
        )
        if connection.is_connected():
            print("✅ Connected to Railway MySQL successfully")
            cursor = connection.cursor()
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            print("📌 Available Tables:", tables)  # Print tables in database
            return connection
    except mysql.connector.Error as e:
        print(f"❌ Error connecting to database: {e}")
        return None
