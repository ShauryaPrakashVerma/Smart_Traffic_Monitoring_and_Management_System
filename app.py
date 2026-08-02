from flask import Flask, render_template, url_for, redirect, session, request

# encrypt and decrypt the password
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

from config import Config
from database.db import db

from routes.controller import register_controller_blueprints
from routes.public import register_public_blueprints
from routes.auth import auth_bp


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
    return render_template("authentication/login.html")



@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        role = request.form.get("role")
        print("======================================")
        print(role)
        print("======================================")
        

        if role == "controller":
            session["role"] = "controller"

            employee_id = request.form.get("employee_id")
            password = request.form.get("password")
            return redirect(url_for("controller_dashboard.dashboard"))

            
        elif role == "viewer":
            session["role"] = "viewer"

            email = request.form.get("email")
            password = request.form.get("password")

            return redirect(url_for('public_livetrafficmap.live_traffic_map'))
            # return "<p>Hello i am user</p>"
            



# register the blueprints for controller
register_controller_blueprints(app)

# register the blueprints for public users
register_public_blueprints(app)

app.register_blueprint(auth_bp)




if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)