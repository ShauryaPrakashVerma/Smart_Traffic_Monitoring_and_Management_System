from flask import Blueprint, render_template

help_and_info_bp = Blueprint('public_helpandinfo', __name__)

@help_and_info_bp.route('/viewer/help_and_info', methods=['GET'])
def help_and_info():
    return render_template('public/help_and_info.html')

