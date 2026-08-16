from db import db
from datetime import datetime


class Saved_Route(db.Model):
    __tablename__ = "saved_route"
    
    id = db.Column(db.Integer, primary_key = True)
    created_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    name = db.Column(db.String(50), nullable = False)
    description = db.Column(db.String(50))
    route_type = db.Column()
    created_at = db.Column(db.DateTime, default = datetime.now)