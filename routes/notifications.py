from flask import Flask, render_template, Blueprint

notifications_bp = Blueprint('controller_notifications', __name__)

@notifications_bp.route("/controller/notifications", methods=["GET"])
def notifications():
    return render_template('controller/notifications.html')