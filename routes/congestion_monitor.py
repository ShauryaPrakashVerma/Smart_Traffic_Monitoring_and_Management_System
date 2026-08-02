from flask import Flask, render_template, Blueprint

congestion_monitor_bp = Blueprint('controller_congestionmonitor', __name__)

@congestion_monitor_bp.route("/controller/congestion_monitor", methods=["GET"])
def congestion_monitor():
    return render_template('controller/congestion_monitor.html')