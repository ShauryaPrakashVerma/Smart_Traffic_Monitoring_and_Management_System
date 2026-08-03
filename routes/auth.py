from flask import Blueprint, session, redirect, url_for, request, render_template

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        role = request.form.get("role")
        print("======================================")
        print(role)
        print("======================================")
        

        if role == "controller":
            session["role"] = "controller"

            employee_id = request.form.get("employee_id")
            password = request.form.get("password")
            return redirect(url_for("controller_dashboard.dashboard"))

            
        elif role == "viewer":
            session["role"] = "viewer"

            email = request.form.get("email")
            password = request.form.get("password")

            return redirect(url_for('public_livetrafficmap.live_traffic_map'))
            # return "<p>Hello i am user</p>"
            
    return render_template("authentication/login.html")


@auth_bp.route("/logout")
def logout():
    session.clear()          # Removes everything stored in the session
    return redirect(url_for("login"))