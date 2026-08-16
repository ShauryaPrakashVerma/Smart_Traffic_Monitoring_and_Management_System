from db import db
from datetime import datetime



class Stolen_vehicle(db.Model):
    __tablename__ = "stolen_vehicle"
    
    id = db.Column(db.Integer, primary_key = True)
    license_plate = db.Column(db.String(100))
    vehicle_type = db.Column(db.String(50))
    model = db.Column(db.String(50))
    color = db.Column(db.String(50))
    reported_date = db.Column(db.DateTime, default= datetime.date)
    police_station = db.Column(db.String(50))
    case_number = db.Column(db.Integer)
    status = db.Column(db.String(100))

