from .dashboard import dashboard_bp
from .live_map import live_map_bp
from .notifications import notifications_bp

from .camera_feeds import camera_feeds_bp
from .congestion_monitor import congestion_monitor_bp
from .vehicle_detection import vehicle_detection_bp
from .classification import classification_bp

from .signal_control import signal_control_bp
from .emergency_corridor import emergency_corridor_bp
from .junction_management import junction_management_bp

from .peak_hour_analysis import peak_hour_analysis_bp
from .historical_records import historical_records_bp
from .reports import reports_bp

from .digital_twin import digital_twin_bp
from .ai_prediction import ai_prediction_bp
from .scenario_simulator import scenario_simulator_bp

from .settings import settings_bp



def register_blueprints(app):
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(live_map_bp)
    app.register_blueprint(notifications_bp)
    
    app.register_blueprint(camera_feeds_bp)
    app.register_blueprint(congestion_monitor_bp)
    app.register_blueprint(vehicle_detection_bp)
    app.register_blueprint(classification_bp)
    
    app.register_blueprint(signal_control_bp)
    app.register_blueprint(emergency_corridor_bp)
    app.register_blueprint(junction_management_bp)
    
    app.register_blueprint(peak_hour_analysis_bp)
    app.register_blueprint(historical_records_bp)
    app.register_blueprint(reports_bp)
    
    app.register_blueprint(digital_twin_bp)
    app.register_blueprint(ai_prediction_bp)
    app.register_blueprint(scenario_simulator_bp)
    
    app.register_blueprint(settings_bp)
    
    
    
    