from flask import Blueprint, render_template

live_stats_bp = Blueprint('public_livestats', __name__)

@live_stats_bp.route('/viewer/live_stats', methods=['GET'])
def live_stats():
    return render_template('public/live_stats.html')

