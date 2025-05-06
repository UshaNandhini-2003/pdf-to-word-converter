class User:
    def __init__(self, user_id, username, email, password_hash, role, last_login, otp_code, otp_expiry):
        self.user_id = user_id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.last_login = last_login
        self.otp_code = otp_code
        self.otp_expiry = otp_expiry


    def to_dict(self):
        return {
            "user_id": self.user_id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "last_login": self.last_login,
            "otp_code": self.otp_code,
            "otp_expiry": self.otp_expiry
        }
