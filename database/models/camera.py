from ..db import db
from datetime import datetime

class Camera(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    junction_id = db.Column(db.Integer)
    camera_name = db.Column(db.String(100))
    stream_url = db.Column(db.String(100))
    camera_type = db.Column(db.String(100))
    direction = db.Column(db.String(100))
    status = db.Column(db.String(100))
    created_at = db.Column(
        db.DateTime,
        default=datetime.now
    )
    
    