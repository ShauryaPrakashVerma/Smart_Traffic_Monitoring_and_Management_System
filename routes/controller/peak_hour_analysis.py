from flask import Flask, render_template, Blueprint

peak_hour_analysis_bp = Blueprint('controller_peakhouranalysis', __name__)

@peak_hour_analysis_bp.route("/controller/peak_hour_analysis", methods=["GET"])
def peak_hour_analysis():
    return render_template('controller/peak_hour_analysis.html')