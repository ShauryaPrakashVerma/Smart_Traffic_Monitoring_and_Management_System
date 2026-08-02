from flask import Flask, render_template, Blueprint

scenario_simulator_bp = Blueprint('controller_scenariosimulator', __name__)

@scenario_simulator_bp.route("/controller/scenario_simulator", methods=["GET"])
def scenario_simulator():
    return render_template('controller/scenario_simulator.html')