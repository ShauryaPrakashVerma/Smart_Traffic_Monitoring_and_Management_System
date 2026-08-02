from .live_traffic_map import live_traffic_map_bp
from .plan_journey import plan_journey_bp
from .raise_complaint import raise_complaint_bp
from .alert_me import alert_me_bp
from .saved_routes import saved_routes_bp
from .live_stats import live_stats_bp
from .help_and_info import help_and_info_bp

def register_public_blueprints(app):
    app.register_blueprint(live_traffic_map_bp)
    app.register_blueprint(plan_journey_bp)
    app.register_blueprint(raise_complaint_bp)
    
    app.register_blueprint(alert_me_bp)
    app.register_blueprint(saved_routes_bp)
    app.register_blueprint(live_stats_bp)
    app.register_blueprint(help_and_info_bp)