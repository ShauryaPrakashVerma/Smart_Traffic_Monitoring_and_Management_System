from flask import Flask, render_template, Blueprint

emergency_corridor_bp = Blueprint('controller_emergencycorridor', __name__)

@emergency_corridor_bp.route("/controller/emergency_corridor", methods=["GET"])
def emergency_corridor():
    return render_template('controller/emergency_corridor.html')