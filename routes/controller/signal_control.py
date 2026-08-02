from flask import Flask, render_template, Blueprint

signal_control_bp = Blueprint('controller_signalcontrol', __name__)

@signal_control_bp.route("/controller/signal_control", methods=["GET"])
def signal_control():
    return render_template('controller/signal_control.html')