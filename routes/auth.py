from flask import Blueprint, session, redirect, url_for

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/logout")
def logout():
    session.clear()          # Removes everything stored in the session
    return redirect(url_for("login"))