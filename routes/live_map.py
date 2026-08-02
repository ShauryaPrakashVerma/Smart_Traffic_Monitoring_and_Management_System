from flask import Flask, render_template, Blueprint

live_map_bp = Blueprint('controller_livemap', __name__)

@live_map_bp.route("/controller/live_map", methods=["GET"])
def live_map():
    return render_template('controller/live_map.html')