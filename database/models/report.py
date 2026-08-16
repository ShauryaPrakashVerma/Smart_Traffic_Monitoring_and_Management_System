from db import db
from datetime import datetime

class Report(db.Model):
    __tablename__ = "report"
    
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(50))
    report_type = db.Column(db.String(50))
    generated_by = db.Column(db.String(50))
    start_date = db.Column(db.DateTime, default= datetime.date)
    end_date = db.Column(db.DateTime, default = datetime.date)
    generated_at = db.Column(db.DateTime, default = datetime.now)
    status = db.Column(db.String(50))
    file_path = db.Column(db.String(50))
    file_size = db.Column(db.Float)
    