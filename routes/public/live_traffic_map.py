
import openrouteservice
import os
import logging

from flask import Blueprint, render_template, request, jsonify
from openrouteservice.exceptions import ApiError
from dotenv import load_dotenv

load_dotenv()


live_traffic_map_bp = Blueprint('public_livetrafficmap', __name__)

@live_traffic_map_bp.route('/viewer/live_traffic_map', methods=['GET'])
def live_traffic_map():
    return render_template('public/live_traffic_map.html')




ORS_API_KEY = os.getenv("ORS_API_KEY")
ors_client = (openrouteservice.Client(key=ORS_API_KEY) if ORS_API_KEY else None)



@live_traffic_map_bp.route("/viewer/live_traffic_map/api/routes", methods=["POST"], endpoint="calculate_routes",)
def calculate_routes():
    """Calculate alternative driving routes between two locations."""

    if ors_client is None:
        return jsonify({
            "error": "Routing service is not configured. Check ORS_API_KEY."
        }), 500

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "A valid JSON request body is required."
        }), 400

    try:
        start = data["start"]
        end = data["end"]

        # OpenRouteService expects [longitude, latitude].
        start_coords = [
            float(start["lng"]),
            float(start["lat"]),
        ]
        end_coords = [
            float(end["lng"]),
            float(end["lat"]),
        ]

    except (KeyError, TypeError, ValueError):
        return jsonify({
            "error": "Provide valid start and end coordinates."
        }), 400

    # Validate coordinate ranges.
    for lng, lat in (start_coords, end_coords):
        if not (
            -180 <= lng <= 180
            and -90 <= lat <= 90
        ):
            return jsonify({
                "error": "Coordinates are outside valid ranges."
            }), 400

    try:
        result = ors_client.directions(
            coordinates=[start_coords, end_coords],
            profile="driving-car",
            format="geojson",
            alternative_routes={
                "target_count": 3,
                "weight_factor": 1.6,
                "share_factor": 0.6,
            },
        )

        features = result.get("features", [])
        routes = []

        for index, feature in enumerate(features):
            properties = feature.get("properties", {})
            summary = properties.get("summary", {})
            geometry = feature.get("geometry", {})

            if (
                geometry.get("type") != "LineString"
                or not geometry.get("coordinates")
            ):
                continue

            routes.append({
                "id": index,
                "geometry": geometry,
                "distance": summary.get("distance", 0),
                "duration": summary.get("duration", 0),
            })

        if not routes:
            return jsonify({
                "error": "No routes were found between these locations."
            }), 404

        return jsonify({"routes": routes}), 200

    except ApiError as exc:

        logging.exception("OpenRouteService API error")
        return jsonify({
            "error": "OpenRouteService request failed.",
            "details": str(exc)
        }), 502

    except Exception:
        # Avoid exposing internal details to the browser.
        logging.exception("Unexpected routing error")

        return jsonify({
            "error": "An unexpected error occurred while calculating routes."
        }), 500
