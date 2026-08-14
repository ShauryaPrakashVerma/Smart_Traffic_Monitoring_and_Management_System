document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       INITIALIZE LEAFLET MAP
    ===================================================== */

  const map = L.map("trafficMap").setView([26.8467, 80.9462], 13);

  /* =====================================================
       OPENSTREETMAP
    ===================================================== */

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  /* =====================================================
       DEMO INTERSECTIONS
       Replace these coordinates with real locations later.
    ===================================================== */

  const intersections = [
    {
      id: "A1",
      lat: 26.855,
      lng: 80.935,
      status: "free",
      vehicles: 12,
      speed: 62,
    },

    {
      id: "A2",
      lat: 26.855,
      lng: 80.95,
      status: "moderate",
      vehicles: 37,
      speed: 41,
    },

    {
      id: "A3",
      lat: 26.855,
      lng: 80.965,
      status: "heavy",
      vehicles: 67,
      speed: 24,
    },

    {
      id: "B1",
      lat: 26.845,
      lng: 80.935,
      status: "moderate",
      vehicles: 42,
      speed: 38,
    },

    {
      id: "B2",
      lat: 26.845,
      lng: 80.95,
      status: "standstill",
      vehicles: 89,
      speed: 8,
    },

    {
      id: "B3",
      lat: 26.845,
      lng: 80.965,
      status: "heavy",
      vehicles: 55,
      speed: 19,
    },

    {
      id: "C1",
      lat: 26.835,
      lng: 80.935,
      status: "free",
      vehicles: 9,
      speed: 58,
    },

    {
      id: "C2",
      lat: 26.835,
      lng: 80.95,
      status: "moderate",
      vehicles: 38,
      speed: 35,
    },

    {
      id: "C3",
      lat: 26.835,
      lng: 80.965,
      status: "free",
      vehicles: 14,
      speed: 54,
    },
  ];

  /* =====================================================
       MARKER STORAGE
    ===================================================== */

  const markerData = [];

  /* =====================================================
       CREATE INTERSECTION MARKERS
    ===================================================== */

  intersections.forEach((intersection) => {
    const markerHTML = `

            <div class="
                intersection-marker
                ${intersection.status}
            ">

                ${intersection.id}

            </div>

        `;

    const icon = L.divIcon({
      className: "",

      html: markerHTML,

      iconSize: [34, 34],

      iconAnchor: [17, 17],

      popupAnchor: [0, -17],
    });

    const marker = L.marker(
      [intersection.lat, intersection.lng],

      {
        icon: icon,
      },
    ).addTo(map);

    /* ===============================================
           POPUP
        =============================================== */

    marker.bindPopup(`

            <div>

                <strong>
                    ${intersection.id} Intersection
                </strong>

                <br>

                <span>
                    Status:
                    <b>${intersection.status.toUpperCase()}</b>
                </span>

                <br>

                <span>
                    Vehicles:
                    ${intersection.vehicles}
                </span>

                <br>

                <span>
                    Average Speed:
                    ${intersection.speed} km/h
                </span>

            </div>

        `);

    markerData.push({
      marker: marker,

      status: intersection.status,

      id: intersection.id,
    });
  });

  /* =====================================================
       EMERGENCY VEHICLE
    ===================================================== */

  const emergencyIcon = L.divIcon({
    className: "",

    html: `
            <div class="emergency-marker"></div>
        `,

    iconSize: [18, 18],

    iconAnchor: [9, 9],
  });

  const emergencyVehicle = L.marker(
    [26.849, 80.957],

    {
      icon: emergencyIcon,
    },
  ).addTo(map);

  emergencyVehicle.bindPopup(`

        <strong>Emergency Vehicle EV-07</strong>

        <br>

        Status: En Route

        <br>

        Priority: HIGH

    `);

  /* =====================================================
       TRAFFIC FILTERS
    ===================================================== */

  const filterButtons = document.querySelectorAll(".traffic-filter");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

      const filter = this.dataset.filter;

      markerData.forEach((item) => {
        if (filter === "all" || item.status === filter) {
          if (!map.hasLayer(item.marker)) {
            item.marker.addTo(map);
          }
        } else {
          if (map.hasLayer(item.marker)) {
            map.removeLayer(item.marker);
          }
        }
      });
    });
  });

  /* =====================================================
       INTERSECTION SIDEBAR FILTER
    ===================================================== */

  const intersectionRows = document.querySelectorAll(".intersection-row");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.dataset.filter;

      intersectionRows.forEach((row) => {
        if (filter === "all") {
          row.style.display = "flex";
        } else if (
          filter === "free" ||
          filter === "moderate" ||
          filter === "heavy" ||
          filter === "standstill"
        ) {
          if (row.dataset.status === filter) {
            row.style.display = "flex";
          } else {
            row.style.display = "none";
          }
        } else {
          row.style.display = "flex";
        }
      });
    });
  });

  /* =====================================================
       PRINT MAP
    ===================================================== */

  const printButton = document.getElementById("printMapBtn");

  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }

  /* =====================================================
       EXPORT KML
    ===================================================== */

  const exportButton = document.getElementById("exportKmlBtn");

  if (exportButton) {
    exportButton.addEventListener("click", function () {
      const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>Smart Traffic Monitoring System</name>
</Document>
</kml>`;

      const blob = new Blob([kml], {
        type: "application/vnd.google-earth.kml+xml",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "traffic_network.kml";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    });
  }

  /* =====================================================
       FIX LEAFLET SIZE
    ===================================================== */

  setTimeout(() => {
    map.invalidateSize();
  }, 200);
});
