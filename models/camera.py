from database.db import db

class Camera(db.Model):
    __tablename__ = "cameras"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100))
    status = db.Column(db.String(20))