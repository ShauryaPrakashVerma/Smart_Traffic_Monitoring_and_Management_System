from flask import Flask, render_template, url_for, redirect, session

# encrypt and decrypt the password
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

# Configure SQLAlchemy
app.config("SQLAlCHEMY_DATABASE_URI") = "sqlite:///users.db"




@app.route("/", methods=["GET", "POST"])
def home():
    if "username" in session:
        return redirect(url_for('dashboard'))
    return render_template("authentication/login.html")


if __name__ == "__main__":
    # Debug mode for development; remove in production
    app.run(debug=True)