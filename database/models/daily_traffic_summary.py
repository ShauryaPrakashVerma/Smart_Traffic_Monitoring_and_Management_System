from db import db
from datetime import datetime


class Daily_Traffic_Summary(db.Model):
    __tablename__ = "daily_traffic_summary"
    
    id = db.Column(db.Integer, primary_key = True)
    junction_id = db.Column(db.Integer, db.ForeignKey("junction.id"))
    date = db.Column(db.DateTime, default = datetime.date)
    total_vehicles = db.Column(db.Integer)
    cars = db.Column(db.Integer)
    bikes = db.Column(db.Integer)
    buses = db.Column(db.Integer)
    trucks = db.Column(db.Integer)
    average_speed = db.Column(db.Float)
    peak_hour = db.Column(db.String)
    peak_vehicle_count = db.Column(db.Integer)
    total_incidents = db.Column(db.Integer)
    total_emergencies = db.Column(db.Integer)
    congestion_score = db.Column(db.Float)
    signal_efficiency = db.Column(db.Float)
    
    