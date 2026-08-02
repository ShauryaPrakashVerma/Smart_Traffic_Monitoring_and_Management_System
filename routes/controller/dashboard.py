from flask import Flask, render_template, Blueprint

dashboard_bp = Blueprint('controller_dashboard', __name__)

@dashboard_bp.route("/controller/dashboard", methods=["GET"])
def dashboard():
    return render_template('controller/dashboard.html')