from flask import Blueprint, render_template

live_traffic_map_bp = Blueprint('public_livetrafficmap', __name__)

@live_traffic_map_bp.route('/viewer/live_traffic_map', methods=['GET'])
def live_traffic_map():
    return render_template('public/live_traffic_map.html')

