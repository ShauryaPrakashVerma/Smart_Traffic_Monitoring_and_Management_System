from flask import Blueprint, render_template

saved_routes_bp = Blueprint('public_savedroutes', __name__)

@saved_routes_bp.route('/viewer/saved_routes', methods=['GET'])
def saved_routes():
    return render_template('public/saved_routes.html')

