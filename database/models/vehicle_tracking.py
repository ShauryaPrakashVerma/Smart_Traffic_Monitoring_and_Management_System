from ..db import db
from datetime import datetime


class Vehicle_Tracking(db.Model):
    
    id = db.Column(db.Integer, primary_key=True)
    track_identifier = db.Column(db.String(20))
    license_plate = db.Column(db.String(100))
    first_seen = db.Column(db.DateTime, default = datetime.now)
    last_seen = db.Column(db.DateTime, default = datetime.now)
    status = db.Column(db.String(50))