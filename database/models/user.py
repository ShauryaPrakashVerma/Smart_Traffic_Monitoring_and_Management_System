from ..db import db
from datetime import datetime, timezone

class User(db.Model):

    id = db.Column(db.Integer, primary_key = True)
    # employee_id = db.Column(db.String(20), unique=True, nullable=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    full_name = db.Column(db.String(50))
    phone_number = db.Column(db.String(15))
    status = db.Column(db.String(20), nullable=False, default = "pending")
    approved_by = db.Column(db.String(20), nullable=True)
    approved_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )

    def check_password():
        pass
        
        
    def set_password():
        pass
    