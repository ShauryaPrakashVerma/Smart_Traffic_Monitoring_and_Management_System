from db import db

class Incident(db.Model):
    __tablename__ = "incident"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))
    severity = db.Column(db.String(20))
    
    # id PK
    # junction_id FK
    # camera_id FK NULL
    # reported_by FK → users.id NULL
    # incident_type
    # severity
    # description
    # detected_at
    # resolved_at
    # status
    # source
    # created_at