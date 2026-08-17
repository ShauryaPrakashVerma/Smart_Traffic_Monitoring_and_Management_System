from flask import Blueprint, session, redirect, url_for, request, render_template
from werkzeug.security import check_password_hash, generate_password_hash
from database.models import User
from datetime import datetime, timezone
from database.db import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":
        
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        
         # Basic validation
        if not email or not password:
            return render_template(
                "auth/login.html",
                error="Please enter email and password."
            )
    

        user = User.query.filter_by(email = email).first()
    
        if user and check_password_hash(user.password_hash, password):
            if user.status != "approved":
                return render_template(
                    "auth/login.html",
                    error="Your account has not been approved yet."
                )
                
        # Store user information in session
        session["user_id"] = user.id
        session["role"] = user.role
        session["email"] = user.email

        print("Login Successful")
        print("User:", user.email)
        print("Role:", user.role)
        
        # Redirect according to role
        if user.role == "admin":
            return redirect(url_for("admin.dashboard"))

        elif user.role == "operator":
            print("operator login")
            return redirect(url_for("controller_dashboard.dashboard"))

        elif user.role == "public":
            return redirect(url_for("public_livetrafficmap.live_traffic_map"))

        else:
            return render_template(
                "auth/login.html",
                error="Invalid user role."
            )
            
    else:
        print("Invalid Credentials")

        return render_template(
            "auth/login.html",
            error="Invalid email or password."
        )

        
          
          
            

@auth_bp.route("/register", methods=["GET","POST"])
def register():
    if request.method == "POST":
        full_name = request.form.get("full_name")
        email = request.form.get("email")
        phone = request.form.get("phone")
        account_type = request.form.get("account_type")
        password = request.form.get("password")
        
        password_hash = generate_password_hash(password)
        username = generate_username(full_name)
        
        status = ""
        approved_by = ""
        approved_at = ""
        
        if account_type == "public":    
            status = "approved"
            approved_by = "system"
            approved_at = datetime.now(timezone.utc)
            
        else:
            # operator
            status = "pending"
            approved_at = datetime.now(timezone.utc)
        
        user = User(
            username = username,
            email = email,
            password_hash=password_hash,
            role = account_type,
            full_name = full_name,
            phone_number=phone,
            status = status,
            approved_by = approved_by,
            approved_at = approved_at
        )
        
        print("Commited")
        
        db.session.add(user)
        db.session.commit()
        
    return render_template("auth/register.html")


@auth_bp.route("/admin/login", methods=['GET','POST'])
def admin_login():
    
    if request.method == "POST":
    
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        
        print(password)
        print(email)
        
        if not email or not password:
            
            print("FAILED: Empty email/password")
            return render_template(
                "auth/admin_login.html",
                error="Please enter email and password."
            )
            
        admin = User.query.filter_by(email = email).first()
        print("USER : ",admin)

        if not admin:
            print("FAILED: Admin/user not found")
            return render_template(
                "auth/admin_login.html",
                error="Invalid email or password."
            )
            
        print("HASH:", admin.password_hash)
        print("ROLE:", admin.role)
        print("STATUS:", admin.status)

        if not check_password_hash(admin.password_hash, password):
            print("FAILED: Password incorrect")
            return render_template(
                "auth/admin_login.html",
                error="Invalid email or password."
            )
            
        print("PASSWORD CORRECT")
        
        if admin.role != "admin":
            print("FAILED: Role is not admin")
            return render_template(
                "auth/admin_login.html",
                error="You do not have administrator access."
            )
            
        print("ROLE CORRECT")
        
        if admin.status != "approved":
            print("FAILED: Admin is not approved")
            return render_template(
                "auth/admin_login.html",
                error="This administrator account is not approved."
            )
            
        print("STATUS CORRECT")
            
        public_users = User.query.filter_by(role="public").all()
        controllers = User.query.filter_by(role="controller").all()
        
        print("(1234)")
        session["role"] = admin.role
        session["email"] = admin.email

        print("Admin Login Successful")
        print("Admin:", admin.email)

        return render_template("admin/dashboard.html", public_users=public_users, controllers=controllers)
    
    # GET Request
    return render_template("auth/admin_login.html")



@auth_bp.route("/logout")
def logout():
    session.clear()          # Removes everything stored in the session
    return redirect(url_for("auth.login"))



# ====================================================
# Utils

def generate_username(name):
    first_name = name.find(" ")
    if first_name != -1:
        return name[0:first_name]
    else:
        return name
    