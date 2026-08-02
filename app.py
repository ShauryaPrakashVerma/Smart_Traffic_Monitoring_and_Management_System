from flask import Flask, render_template, url_for, redirect, session, request

# encrypt and decrypt the password
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

from config import Config
from database.db import db

from routes import register_blueprints


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

        if role == "controller":

            employee_id = request.form.get("employee_id")
            password = request.form.get("password")

            return redirect(url_for("controller_dashboard.dashboard"))

            
        elif role == "viewer":

            email = request.form.get("email")
            password = request.form.get("password")


            # return "<p>Hello i am user</p>"
            
    return redirect(url_for('dashboard.dashboard'))

register_blueprints(app)




if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)