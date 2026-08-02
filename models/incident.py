from database.db import db

class Incident(db.Model):
    __tablename__ = "incidents"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))
    severity = db.Column(db.String(20))