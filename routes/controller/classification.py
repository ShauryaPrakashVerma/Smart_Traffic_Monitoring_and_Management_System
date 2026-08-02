from flask import Flask, render_template, Blueprint

classification_bp = Blueprint('controller_classification', __name__)

@classification_bp.route("/controller/classification", methods=["GET"])
def classification():
    return render_template('controller/classification.html')