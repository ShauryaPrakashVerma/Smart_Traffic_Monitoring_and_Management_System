from flask import Blueprint, render_template

alert_me_bp = Blueprint('public_alertme', __name__)

@alert_me_bp.route('/viewer/alert_me', methods=['GET'])
def alert_me():
    return render_template('public/alert_me.html')

