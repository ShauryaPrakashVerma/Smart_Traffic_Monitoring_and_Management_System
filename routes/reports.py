from flask import Flask, render_template, Blueprint

reports_bp = Blueprint('controller_reports', __name__)

@reports_bp.route("/controller/reports", methods=["GET"])
def reports():
    return render_template('controller/reports.html')