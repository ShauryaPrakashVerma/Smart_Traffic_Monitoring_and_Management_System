from flask import Flask, render_template, Blueprint

camera_feeds_bp = Blueprint('controller_camerafeeds', __name__)

@camera_feeds_bp.route("/controller/camera_feeds", methods=["GET"])
def camera_feeds():
    return render_template('controller/camera_feeds.html')