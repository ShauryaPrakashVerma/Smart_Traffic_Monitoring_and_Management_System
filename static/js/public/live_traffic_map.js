document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       MAP INITIALIZATION
    ====================================================== */

  const map = L.map("trafficMap", {
    zoomControl: true,
    attributionControl: true,
  });

  /*
   * OpenStreetMap tiles
   */

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  }).addTo(map);

  /*
   * Initial city.
   *
   * New Delhi is only the initial viewport.
   * Once the user searches a route, the map
   * automatically moves to the searched locations.
   */

  map.setView([28.6139, 77.209], 12);

  /* =====================================================
       ELEMENTS
    ====================================================== */

  const fromInput = document.getElementById("fromLocation");

  const toInput = document.getElementById("toLocation");

  const findRouteBtn = document.getElementById("findRouteBtn");

  const clearRouteBtn = document.getElementById("clearRouteBtn");

  const locateMeBtn = document.getElementById("locateMeBtn");

  const routeStatus = document.getElementById("routeStatus");

  const routeResults = document.getElementById("routeResults");

  const routeList = document.getElementById("routeList");

  /* =====================================================
       MAP LAYERS
    ====================================================== */

  let routeLayers = [];

  let fromMarker = null;

  let toMarker = null;

  let trafficLayers = [];

  let currentRoutes = [];

  /* =====================================================
       DEMO TRAFFIC NETWORK
    ====================================================== */

  /*
   * These are visual traffic overlays.
   *
   * They are independent of the actual route engine.
   * This gives the page the same traffic-monitoring
   * appearance as your original design.
   */

  const trafficRoads = [
    {
      name: "Avenue A",
      coordinates: [
        [28.63, 77.19],
        [28.63, 77.21],
        [28.63, 77.23],
      ],
      status: "free",
    },

    {
      name: "Avenue B",
      coordinates: [
        [28.615, 77.19],
        [28.615, 77.21],
        [28.615, 77.23],
      ],
      status: "heavy",
    },

    {
      name: "Avenue C",
      coordinates: [
        [28.6, 77.19],
        [28.6, 77.21],
        [28.6, 77.23],
      ],
      status: "moderate",
    },

    {
      name: "North Connector",
      coordinates: [
        [28.63, 77.19],
        [28.615, 77.19],
        [28.6, 77.19],
      ],
      status: "moderate",
    },

    {
      name: "Central Connector",
      coordinates: [
        [28.63, 77.21],
        [28.615, 77.21],
        [28.6, 77.21],
      ],
      status: "standstill",
    },

    {
      name: "East Connector",
      coordinates: [
        [28.63, 77.23],
        [28.615, 77.23],
        [28.6, 77.23],
      ],
      status: "heavy",
    },
  ];

  /* =====================================================
       TRAFFIC COLORS
    ====================================================== */

  const trafficColors = {
    free: "#16a34a",

    moderate: "#d99100",

    heavy: "#f97316",

    standstill: "#ef4444",
  };

  /* =====================================================
       DRAW TRAFFIC NETWORK
    ====================================================== */

  trafficRoads.forEach(function (road) {
    const layer = L.polyline(road.coordinates, {
      color: trafficColors[road.status],

      weight: 6,

      opacity: 0.78,

      lineCap: "round",

      lineJoin: "round",
    }).addTo(map);

    layer.bindTooltip(
      `
                <strong>${road.name}</strong>
                <br>
                Traffic:
                ${capitalize(road.status)}
            `,
      {
        sticky: true,
      },
    );

    trafficLayers.push(layer);
  });

  /* =====================================================
       ROUTE SEARCH
    ====================================================== */

  findRouteBtn.addEventListener("click", async function () {
    const from = fromInput.value.trim();

    const to = toInput.value.trim();

    /*
     * Validate input.
     */

    if (!from || !to) {
      showStatus(
        "Please enter both the starting location and destination.",
        true,
      );

      return;
    }

    /*
     * Prevent repeated requests.
     */

    findRouteBtn.disabled = true;

    findRouteBtn.textContent = "Finding Routes...";

    showStatus("Locating the selected places...", false, true);

    try {
      /*
       * Geocode FROM.
       */

      const fromLocation = await geocodeLocation(from);

      if (!fromLocation) {
        throw new Error(`Could not find "${from}".`);
      }

      /*
       * Geocode TO.
       */

      const toLocation = await geocodeLocation(to);

      if (!toLocation) {
        throw new Error(`Could not find "${to}".`);
      }

      showStatus("Calculating available routes...", false, true);

      /*
       * Request route alternatives.
       */

      const routes = await getRoutes(fromLocation, toLocation);

      if (!routes || routes.length === 0) {
        throw new Error("No route could be found between these locations.");
      }

      currentRoutes = routes;

      /*
       * Display markers.
       */

      displayMarkers(fromLocation, toLocation);

      /*
       * Display routes.
       */

      displayRoutes(routes);

      /*
       * Fit map around routes.
       */

      fitRoutes(routes);

      /*
       * Route panel.
       */

      displayRouteResults(routes);

      showStatus(
        `${routes.length} route option${routes.length === 1 ? "" : "s"} found.`,
        false,
      );
    } catch (error) {
      console.error("Route error:", error);

      showStatus(error.message || "Unable to calculate the route.", true);
    } finally {
      findRouteBtn.disabled = false;

      findRouteBtn.textContent = "Find Route";
    }
  });

  /* =====================================================
       GEOCODING
    ====================================================== */

  async function geocodeLocation(query) {
    /*
     * Nominatim geocoding.
     *
     * For production, move this request through
     * your Flask backend and add appropriate
     * caching/rate limiting.
     */

    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=json" +
      "&limit=1" +
      "&q=" +
      encodeURIComponent(query);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Location search failed.");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return {
      lat: Number(data[0].lat),

      lon: Number(data[0].lon),

      display: data[0].display_name,
    };
  }

  /* =====================================================
       ROUTING
    ====================================================== */

  async function getRoutes(from, to) {
    /*
     * OSRM route service.
     *
     * alternatives=true requests
     * alternative routes.
     */

    const url =
      "https://router.project-osrm.org/route/v1/driving/" +
      `${from.lon},${from.lat};${to.lon},${to.lat}` +
      "?overview=full" +
      "&geometries=geojson" +
      "&steps=true" +
      "&alternatives=true";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Routing service is unavailable.");
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes) {
      throw new Error("No route could be calculated.");
    }

    return data.routes;
  }

  /* =====================================================
       DISPLAY MARKERS
    ====================================================== */

  function displayMarkers(from, to) {
    /*
     * Remove old markers.
     */

    if (fromMarker) {
      map.removeLayer(fromMarker);
    }

    if (toMarker) {
      map.removeLayer(toMarker);
    }

    /*
     * FROM marker.
     */

    fromMarker = L.marker([from.lat, from.lon], {
      icon: createMarkerIcon("from"),
    }).addTo(map);

    fromMarker.bindPopup(
      `
                <div class="popup-title">
                    Starting Point
                </div>

                <div class="popup-value">
                    ${escapeHTML(from.display)}
                </div>
            `,
    );

    /*
     * TO marker.
     */

    toMarker = L.marker([to.lat, to.lon], {
      icon: createMarkerIcon("to"),
    }).addTo(map);

    toMarker.bindPopup(
      `
                <div class="popup-title">
                    Destination
                </div>

                <div class="popup-value">
                    ${escapeHTML(to.display)}
                </div>
            `,
    );
  }

  /* =====================================================
       CUSTOM MARKER
    ====================================================== */

  function createMarkerIcon(type) {
    return L.divIcon({
      className: "",

      html: `<div class="route-marker ${type}"></div>`,

      iconSize: [22, 22],

      iconAnchor: [11, 11],
    });
  }

  /* =====================================================
       DISPLAY ROUTES
    ====================================================== */

  function displayRoutes(routes) {
    /*
     * Remove previous route layers.
     */

    routeLayers.forEach(function (layer) {
      map.removeLayer(layer);
    });

    routeLayers = [];

    /*
     * Draw alternatives.
     *
     * First route = primary route.
     */

    routes.forEach(function (route, index) {
      const coordinates = route.geometry.coordinates.map(function (coordinate) {
        return [coordinate[1], coordinate[0]];
      });

      const layer = L.polyline(coordinates, {
        color: index === 0 ? "#2563eb" : "#64748b",

        weight: index === 0 ? 8 : 5,

        opacity: index === 0 ? 0.95 : 0.48,

        lineCap: "round",

        lineJoin: "round",
      }).addTo(map);

      /*
       * Clicking route makes it primary.
       */

      layer.on("click", function () {
        selectRoute(index);
      });

      layer.bindTooltip(`Route ${index + 1}`, {
        sticky: true,
      });

      routeLayers.push(layer);
    });
  }

  /* =====================================================
       SELECT ROUTE
    ====================================================== */

  function selectRoute(selectedIndex) {
    routeLayers.forEach(function (layer, index) {
      if (index === selectedIndex) {
        layer.setStyle({
          color: "#2563eb",

          weight: 8,

          opacity: 0.95,
        });

        layer.bringToFront();
      } else {
        layer.setStyle({
          color: "#64748b",

          weight: 5,

          opacity: 0.48,
        });
      }
    });

    /*
     * Update route cards.
     */

    const cards = document.querySelectorAll(".route-option");

    cards.forEach(function (card, index) {
      card.classList.toggle("selected", index === selectedIndex);
    });

    /*
     * Scroll selected route
     * into visibility.
     */

    const selectedCard = document.querySelector(
      `.route-option[data-index="${selectedIndex}"]`,
    );

    if (selectedCard) {
      selectedCard.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }

  /* =====================================================
       DISPLAY ROUTE CARDS
    ====================================================== */

  function displayRouteResults(routes) {
    routeList.innerHTML = "";

    routes.forEach(function (route, index) {
      const distance = formatDistance(route.distance);

      const duration = formatDuration(route.duration);

      /*
       * Simulated traffic state.
       *
       * In your final project this can be
       * replaced with your YOLO traffic data.
       */

      const traffic = getTrafficForRoute(index, route);

      const card = document.createElement("div");

      card.className = "route-option";

      if (index === 0) {
        card.classList.add("selected");
      }

      card.dataset.index = index;

      card.innerHTML = `

                    <div class="route-option-top">

                        <span class="route-name">
                            ${
                              index === 0
                                ? "Best Route"
                                : `Alternative ${index}`
                            }
                        </span>

                        <span class="route-time">
                            ${duration}
                        </span>

                    </div>


                    <div class="route-option-details">

                        <span class="route-dot"></span>

                        <span>
                            ${distance}
                        </span>

                        <span>
                            ·
                            ${Math.round(route.duration / 60)} min
                        </span>


                        <span
                            class="
                                route-traffic
                                ${traffic.className}
                            "
                        >
                            ${traffic.label}
                        </span>

                    </div>

                `;

      card.addEventListener("click", function () {
        selectRoute(index);
      });

      routeList.appendChild(card);
    });

    routeResults.hidden = false;
  }

  /* =====================================================
       ROUTE TRAFFIC
    ====================================================== */

  function getTrafficForRoute(index, route) {
    /*
     * Demo logic.
     *
     * Later you can calculate this using:
     *
     * YOLO vehicle count
     * average speed
     * road occupancy
     * congestion score
     */

    if (index === 0) {
      return {
        label: "LOW TRAFFIC",

        className: "free",
      };
    }

    if (index === 1) {
      return {
        label: "MODERATE",

        className: "moderate",
      };
    }

    return {
      label: "HEAVY",

      className: "heavy",
    };
  }

  /* =====================================================
       FIT ROUTES
    ====================================================== */

  function fitRoutes(routes) {
    const allCoordinates = [];

    routes.forEach(function (route) {
      route.geometry.coordinates.forEach(function (coordinate) {
        allCoordinates.push([coordinate[1], coordinate[0]]);
      });
    });

    if (allCoordinates.length > 0) {
      const bounds = L.latLngBounds(allCoordinates);

      map.fitBounds(bounds, {
        paddingTopLeft: [380, 80],

        paddingBottomRight: [80, 80],
      });
    }
  }

  /* =====================================================
       CLEAR ROUTE
    ====================================================== */

  clearRouteBtn.addEventListener("click", function () {
    clearRoutes();
  });

  function clearRoutes() {
    /*
     * Remove route lines.
     */

    routeLayers.forEach(function (layer) {
      map.removeLayer(layer);
    });

    routeLayers = [];

    currentRoutes = [];

    /*
     * Remove markers.
     */

    if (fromMarker) {
      map.removeLayer(fromMarker);

      fromMarker = null;
    }

    if (toMarker) {
      map.removeLayer(toMarker);

      toMarker = null;
    }

    /*
     * Reset fields.
     */

    fromInput.value = "";

    toInput.value = "";

    /*
     * Reset results.
     */

    routeList.innerHTML = "";

    routeResults.hidden = true;

    routeStatus.hidden = true;

    /*
     * Return to city view.
     */

    map.setView([28.6139, 77.209], 12);
  }

  /* =====================================================
       LOCATE USER
    ====================================================== */

  locateMeBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      showStatus("Geolocation is not supported by this browser.", true);

      return;
    }

    showStatus("Finding your current location...", false, true);

    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;

        const lon = position.coords.longitude;

        map.setView([lat, lon], 15);

        L.circleMarker([lat, lon], {
          radius: 8,

          color: "#2563eb",

          fillColor: "#60a5fa",

          fillOpacity: 0.9,

          weight: 3,
        })
          .addTo(map)
          .bindPopup("Your current location")
          .openPopup();

        showStatus("Current location found.", false);
      },

      function () {
        showStatus("Unable to access your current location.", true);
      },
    );
  });

  /* =====================================================
       ENTER KEY
    ====================================================== */

  fromInput.addEventListener("keydown", handleEnter);

  toInput.addEventListener("keydown", handleEnter);

  function handleEnter(event) {
    if (event.key === "Enter") {
      findRouteBtn.click();
    }
  }

  /* =====================================================
       ESCAPE KEY
    ====================================================== */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      clearRoutes();
    }
  });

  /* =====================================================
       STATUS
    ====================================================== */

  function showStatus(message, isError = false, isLoading = false) {
    routeStatus.hidden = false;

    routeStatus.textContent = message;

    routeStatus.classList.toggle("error", isError);

    routeStatus.classList.toggle("loading", isLoading);
  }

  /* =====================================================
       FORMAT DISTANCE
    ====================================================== */

  function formatDistance(meters) {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }

    return `${(meters / 1000).toFixed(1)} km`;
  }

  /* =====================================================
       FORMAT DURATION
    ====================================================== */

  function formatDuration(seconds) {
    const minutes = Math.round(seconds / 60);

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);

    const remaining = minutes % 60;

    if (remaining === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remaining} min`;
  }

  /* =====================================================
       CAPITALIZE
    ====================================================== */

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  /* =====================================================
       ESCAPE HTML
    ====================================================== */

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
  }
});
