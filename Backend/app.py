from flask import Flask
from flask_cors import CORS


# Import API and Scraper Blueprints (No Changes)
from api.auth_api import auth_blueprint  
from api.upload_api import upload_bp
from api.conversion_api import convert_bp
from api.export_api import export_api

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Allow Cross-Origin Requests (CORS)


# Register Blueprints (No Changes)
app.register_blueprint(auth_blueprint, url_prefix='/api')
app.register_blueprint(upload_bp, url_prefix="/api")
app.register_blueprint(convert_bp, url_prefix="/api")
app.register_blueprint(export_api, url_prefix="/api")

# Run API Globally
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
