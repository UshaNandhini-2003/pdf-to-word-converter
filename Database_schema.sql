-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    last_login TIMESTAMP NULL DEFAULT NULL,
    otp_code VARCHAR(6) NULL,
    otp_expiry TIMESTAMP NULL
);

CREATE TABLE pdf_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,  -- Foreign key if authentication is used
    file_name VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,  -- File size in bytes
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pdf_content LONGBLOB NOT NULL,  -- Column to store raw XML content
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE conversions (
    conversion_id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT NOT NULL,  -- Links to the uploaded XML file
    user_id INT NULL,  -- User who performed conversion (optional)
    input_format ENUM('PDF') NOT NULL,  -- Input file type
    output_format ENUM('DOCX') NOT NULL,  -- Output format
    status ENUM('Pending', 'Processing', 'Completed', 'Failed') DEFAULT 'Pending',
    converted_file_path VARCHAR(500) NULL,  -- Path to converted file
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES xml_files(file_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    conversion_id INT NOT NULL,  -- Links to a conversion record
    log_message TEXT NOT NULL,  -- Error message or processing status
    log_level ENUM('INFO', 'WARNING', 'ERROR') NOT NULL,  -- Log severity level
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversion_id) REFERENCES conversions(conversion_id) ON DELETE CASCADE
);
