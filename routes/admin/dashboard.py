from flask import Flask, render_template, Blueprint

admin_bp = Blueprint('admin', __name__)

@admin_bp.route("/admin/dashboard", methods=["GET", "POST"])
def admin_dashboard():
    return render_template('admin/dashboard.html')