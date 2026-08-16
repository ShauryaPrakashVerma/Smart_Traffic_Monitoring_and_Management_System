from ..db import db
from datetime import datetime

class Vehicle_Detection(db.Model):
    
    id = db.Column(db.Integer, primary_key = True)
    # camera_id = db.Column(db.Integer, db.ForeignKey("cameras.id"))
    # junction_id = db.Column(db.Integer, db.ForeignKey("junctions.id"))
    timestamp = db.Column(db.DateTime, default = datetime.time)
    track_id = db.Column(db.Integer)
    vehicle_type = db.Column(db.String(100))
    license_plate = db.Column(db.String(100))
    plate_confidence = db.Column(db.Float)
    vehicle_confidence = db.Column(db.Float)
    speed = db.Column(db.Integer)
    lane = db.Column(db.Integer)
    direction = db.Column(db.String(100))
    image_path = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default = datetime.now)