document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       LEAFLET MAP
    ====================================================== */

  const mapElement = document.getElementById("dashboardMap");

  if (!mapElement) {
    return;
  }

  /*
   * Lucknow coordinates
   *
   * 26.8467° N
   * 80.9462° E
   */

  const map = L.map("dashboardMap").setView([26.8467, 80.9462], 13);

  /* OpenStreetMap tiles */

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  /* =====================================================
       INTERSECTION DATA
    ====================================================== */

  const intersections = [
    {
      id: "A1",
      name: "A1 North",
      lat: 26.855,
      lng: 80.925,
      vehicles: 12,
      speed: 62,
      status: "free",
    },

    {
      id: "A2",
      name: "A2 High Street",
      lat: 26.852,
      lng: 80.946,
      vehicles: 34,
      speed: 31,
      status: "moderate",
    },

    {
      id: "A3",
      name: "A3 Interchange",
      lat: 26.85,
      lng: 80.97,
      vehicles: 67,
      speed: 24,
      status: "heavy",
    },

    {
      id: "B1",
      name: "B1 Junction",
      lat: 26.84,
      lng: 80.925,
      vehicles: 41,
      speed: 29,
      status: "moderate",
    },

    {
      id: "B2",
      name: "B2 Junction Centre",
      lat: 26.84,
      lng: 80.946,
      vehicles: 89,
      speed: 8,
      status: "standstill",
    },

    {
      id: "B3",
      name: "B3 On Ramp",
      lat: 26.84,
      lng: 80.97,
      vehicles: 55,
      speed: 19,
      status: "heavy",
    },

    {
      id: "C1",
      name: "C1 Entry Gate",
      lat: 26.828,
      lng: 80.925,
      vehicles: 9,
      speed: 58,
      status: "free",
    },

    {
      id: "C2",
      name: "C2 Central",
      lat: 26.828,
      lng: 80.946,
      vehicles: 31,
      speed: 35,
      status: "moderate",
    },

    {
      id: "C3",
      name: "C3 South",
      lat: 26.828,
      lng: 80.97,
      vehicles: 14,
      speed: 54,
      status: "free",
    },
  ];

  /* =====================================================
       STATUS COLORS
    ====================================================== */

  const statusColors = {
    free: "#16a34a",

    moderate: "#d97706",

    heavy: "#f97316",

    standstill: "#dc2626",
  };

  /* =====================================================
       CREATE INTERSECTION MARKERS
    ====================================================== */

  const markerMap = {};

  intersections.forEach(function (intersection) {
    const color = statusColors[intersection.status];

    /*
     * Custom circular marker
     */

    const icon = L.divIcon({
      className: "dashboard-intersection-marker",

      html: `
                    <div
                        style="
                            width:34px;
                            height:34px;
                            border:3px solid ${color};
                            border-radius:50%;
                            background:#ffffff;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            font-size:11px;
                            font-weight:700;
                            color:#111827;
                            box-shadow:0 1px 5px rgba(0,0,0,.25);
                        "
                    >
                        ${intersection.id}
                    </div>
                `,

      iconSize: [34, 34],

      iconAnchor: [17, 17],
    });

    const marker = L.marker([intersection.lat, intersection.lng], {
      icon: icon,
    }).addTo(map);

    /*
     * Popup
     */

    marker.bindPopup(`

            <div class="dashboard-map-popup">

                <strong>
                    ${intersection.id} — ${intersection.name}
                </strong>

                <p>
                    Vehicles:
                    <b>${intersection.vehicles}</b>
                </p>

                <p>
                    Average speed:
                    <b>${intersection.speed} km/h</b>
                </p>

                <span
                    class="dashboard-popup-status"
                    style="
                        background:${color};
                        color:white;
                    "
                >
                    ${intersection.status.toUpperCase()}
                </span>

            </div>

        `);

    markerMap[intersection.id] = marker;
  });

  /* =====================================================
       EMERGENCY VEHICLE
    ====================================================== */

  const emergencyIcon = L.divIcon({
    className: "dashboard-emergency-marker",

    html: `
                <div
                    style="
                        width:22px;
                        height:22px;
                        background:#ef4444;
                        border:3px solid white;
                        border-radius:50%;
                        box-shadow:
                            0 0 0 5px rgba(239,68,68,.25);
                    "
                ></div>
            `,

    iconSize: [22, 22],

    iconAnchor: [11, 11],
  });

  const emergencyMarker = L.marker([26.845, 80.958], {
    icon: emergencyIcon,
  }).addTo(map);

  emergencyMarker.bindPopup(`

        <div class="dashboard-map-popup">

            <strong>
                🚑 UNIT EV-07
            </strong>

            <p>
                Emergency vehicle
            </p>

            <p>
                Route:
                <b>A3 → B3 → C3</b>
            </p>

            <span
                class="dashboard-popup-status"
                style="
                    background:#ef4444;
                    color:white;
                "
            >
                ACTIVE
            </span>

        </div>

    `);

  /* =====================================================
       EMERGENCY ROUTE
    ====================================================== */

  let emergencyRoute = null;

  function activateEmergencyRoute() {
    const routeCoordinates = [
      [26.85, 80.97],

      [26.84, 80.97],

      [26.828, 80.97],
    ];

    emergencyRoute = L.polyline(routeCoordinates, {
      color: "#ef4444",

      weight: 6,

      opacity: 0.85,

      dashArray: "10 8",
    }).addTo(map);

    map.fitBounds(emergencyRoute.getBounds(), {
      padding: [30, 30],
    });
  }

  /* =====================================================
       EMERGENCY BUTTON
    ====================================================== */

  const emergencyButton = document.getElementById("dashboardEmergencyBtn");

  let emergencyActive = false;

  if (emergencyButton) {
    emergencyButton.addEventListener("click", function () {
      emergencyActive = !emergencyActive;

      if (emergencyActive) {
        activateEmergencyRoute();

        this.innerHTML = "✕ Deactivate Emergency";

        this.style.background = "#fee2e2";

        this.style.borderColor = "#ef4444";

        this.style.color = "#dc2626";

        emergencyMarker.openPopup();
      } else {
        if (emergencyRoute) {
          map.removeLayer(emergencyRoute);

          emergencyRoute = null;
        }

        this.innerHTML = "🚨 Emergency";

        this.style.background = "";

        this.style.borderColor = "";

        this.style.color = "";
      }
    });
  }

  /* =====================================================
       DIGITAL TWIN
    ====================================================== */

  const digitalTwinButtons = [
    document.getElementById("dashboardDigitalTwinBtn"),

    document.getElementById("digitalTwinBottomBtn"),
  ];

  digitalTwinButtons.forEach(function (button) {
    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      window.location.href = "/controller/digital_twin";
    });
  });

  /* =====================================================
       ACKNOWLEDGE ALERTS
    ====================================================== */

  document.querySelectorAll(".dashboard-ack-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      const alert = this.closest(".dashboard-alert");

      if (!alert) {
        return;
      }

      const status = alert.querySelector(".alert-status");

      status.textContent = "ACKNOWLEDGED";

      status.classList.remove("active");

      status.classList.add("acknowledged");

      this.remove();
    });
  });

  /* =====================================================
       BOTTOM NAVIGATION
    ====================================================== */

  const navigationButtons = {
    signalTimingBtn: "/controller/signal_control",

    emergencyCorridorBtn: "/controller/emergency_corridor",

    cameraBtn: "/controller/camera_feeds",

    predictionBtn: "/controller/ai_prediction",

    generateReportBtn: "/controller/reports",
  };

  Object.keys(navigationButtons).forEach(function (id) {
    const button = document.getElementById(id);

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      window.location.href = navigationButtons[id];
    });
  });

  /* =====================================================
       MAP RESIZE FIX
    ====================================================== */

  setTimeout(function () {
    map.invalidateSize();
  }, 300);
});
