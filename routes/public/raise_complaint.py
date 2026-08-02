from flask import Blueprint, render_template

raise_complaint_bp = Blueprint('public_raisecomplaint', __name__)

@raise_complaint_bp.route('/viewer/raise_complaint', methods=['GET'])
def raise_complaint():
    return render_template('public/raise_complaint.html')

