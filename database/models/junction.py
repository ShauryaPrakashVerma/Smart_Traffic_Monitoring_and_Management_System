from datetime import datetime

from ..db import db

class Junction(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    status = db.Column(db.Boolean)
    created_at = db.Column(
        db.DateTime,
        default=datetime.now
    )