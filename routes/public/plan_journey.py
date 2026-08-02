from flask import Blueprint, render_template

plan_journey_bp = Blueprint('public_planjourney', __name__)

@plan_journey_bp.route('/viewer/plan_journey', methods=['GET'])
def plan_journey():
    return render_template('public/plan_journey.html')

