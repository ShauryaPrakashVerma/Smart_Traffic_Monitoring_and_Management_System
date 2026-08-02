from flask import Flask, render_template, Blueprint

digital_twin_bp = Blueprint('controller_digitaltwin', __name__)

@digital_twin_bp.route("/controller/digital_twin", methods=["GET"])
def digital_twin():
    return render_template('controller/digital_twin.html')