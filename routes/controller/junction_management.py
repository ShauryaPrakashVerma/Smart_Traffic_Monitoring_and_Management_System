from flask import Flask, render_template, Blueprint

junction_management_bp = Blueprint('controller_junctionmanagement', __name__)

@junction_management_bp.route("/controller/junction_management", methods=["GET"])
def junction_management():
    return render_template('controller/junction_management.html')