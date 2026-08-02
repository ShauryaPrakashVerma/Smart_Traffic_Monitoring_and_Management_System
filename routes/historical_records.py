from flask import Flask, render_template, Blueprint

historical_records_bp = Blueprint('controller_historicalrecords', __name__)

@historical_records_bp.route("/controller/historical_records", methods=["GET"])
def historical_records():
    return render_template('controller/historical_records.html')