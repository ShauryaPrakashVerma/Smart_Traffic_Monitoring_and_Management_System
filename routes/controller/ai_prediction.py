from flask import Flask, render_template, Blueprint

ai_prediction_bp = Blueprint('controller_aiprediction', __name__)

@ai_prediction_bp.route("/controller/ai_prediction", methods=["GET"])
def ai_prediction():
    return render_template('controller/ai_prediction.html')