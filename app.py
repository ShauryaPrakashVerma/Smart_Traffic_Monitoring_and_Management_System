from flask import Flask, render_template, url_for, redirect, session, request

# encrypt and decrypt the password
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

from config import Config
from database.db import db

from routes.controller import register_controller_blueprints
from routes.public import register_public_blueprints
from routes.auth import auth_bp

from database.models import (
    Camera, Daily_Traffic_Summary, Incident, Junction, Report, Saved_Route, Stolen_Vehicle, User, Vehicle_Detection, Vehicle_Tracking
)



app = Flask(__name__)

app.config.from_object(Config)

# Initialize SQLAlchemy with the Flask app
db.init_app(app)

with app.app_context():
    db.create_all()




@app.route("/", methods=["GET", "POST"])
def home():
    if "username" in session:
        return redirect(url_for('dashboard'))
    return render_template("auth/login.html")





# register the blueprints for controller
register_controller_blueprints(app)

# register the blueprints for public users
register_public_blueprints(app)

app.register_blueprint(auth_bp)




if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)