from flask import Flask, render_template, Blueprint

vehicle_detection_bp = Blueprint('controller_vehicledetection', __name__)

@vehicle_detection_bp.route("/controller/vehicle_detection", methods=["GET"])
def vehicle_detection():
    return render_template('controller/vehicle_detection.html')