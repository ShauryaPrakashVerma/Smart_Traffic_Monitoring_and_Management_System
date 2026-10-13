document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       MAP INITIALIZATION
    ====================================================== */

  const map = L.map("trafficMap", {
    zoomControl: true,
    attributionControl: true,
  });

  // OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
  }).addTo(map);

  // Initial city: New Delhi
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
  let currentRoutes = [];

  /* =====================================================
       ROUTE SEARCH
    ====================================================== */

  findRouteBtn.addEventListener("click", async function () {
    
    const from = fromInput.value.trim();
    const to = toInput.value.trim();

    // Validate input
    if (!from || !to) {
      showStatus(
        "Please enter both the starting location and destination.",
        true,
      );
      return;
    }

    // Prevent repeated requests
    findRouteBtn.disabled = true;
    findRouteBtn.textContent = "Finding Routes...";

    showStatus("Locating the selected places...", false, true);

    try {
      // Geocode starting location
      const fromLocation = await geocodeLocation(from);

      if (!fromLocation) {
        throw new Error(`Could not find "${from}".`);
      }

      // Geocode destination
      const toLocation = await geocodeLocation(to);

      console.log("Geocoded start:", fromLocation);
      console.log("Geocoded destination:", toLocation);

      if (!toLocation) {
        throw new Error(`Could not find "${to}".`);
      }

      showStatus("Calculating available routes...", false, true);

      // Request alternative routes from Flask
      const routes = await getRoutes(fromLocation, toLocation);

      if (!routes || routes.length === 0) {
        throw new Error("No route could be found between these locations.");
      }

      currentRoutes = routes;

      // Display starting and destination markers
      displayMarkers(fromLocation, toLocation);

      // Draw all returned routes
      displayRoutes(routes);

      // Fit map around the routes
      fitRoutes(routes);

      // Display route cards
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
     * Nominatim converts the user's location text
     * into latitude and longitude.
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
      throw new Error(`Location search failed (HTTP ${response.status}).`);
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
       ROUTING - FLASK + OPENROUTESERVICE PYTHON SDK
    ====================================================== */

  async function getRoutes(from, to) {
  
    console.log("Coordinates being sent to Flask:", {
      start: { lat: from.lat, lng: from.lon },
      end: { lat: to.lat, lng: to.lon }
    });

    const response = await fetch("/viewer/live_traffic_map/api/routes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        start: {
          lat: from.lat,
          lng: from.lon,
        },
        end: {
          lat: to.lat,
          lng: to.lon,
        },
      }),
    });

    // Read the response as text first so HTML error pages
    // can be diagnosed instead of producing a generic JSON error.
    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error("Invalid routing response:", {
        status: response.status,
        url: response.url,
        response: responseText.slice(0, 500),
      });

      throw new Error(
        `Routing endpoint returned a non-JSON response ` +
          `(HTTP ${response.status}). Check the Flask route and terminal.`,
      );
    }

    if (!response.ok) {
      throw new Error(
        data.error || `Routing request failed (HTTP ${response.status}).`,
      );
    }

    if (!data || !Array.isArray(data.routes) || data.routes.length === 0) {
      throw new Error(
        data?.error || "No routes were returned by the routing service.",
      );
    }

    /*
     * Validate and normalize the backend response.
     * The Python handler returns GeoJSON geometry,
     * distance in metres, and duration in seconds.
     */

    return data.routes.map(function (route, index) {
      const distance =
        route.distance != null
          ? Number(route.distance)
          : Number(route.distance_km) * 1000;

      const duration =
        route.duration != null
          ? Number(route.duration)
          : Number(route.duration_min) * 60;

      if (
        !route.geometry ||
        route.geometry.type !== "LineString" ||
        !Array.isArray(route.geometry.coordinates) ||
        route.geometry.coordinates.length === 0 ||
        !Number.isFinite(distance) ||
        !Number.isFinite(duration)
      ) {
        console.error("Invalid route object:", route);

        throw new Error(
          `Route ${index + 1} contains invalid geometry or measurements.`,
        );
      }

      return {
        id: route.id ?? index,
        geometry: route.geometry,
        distance: distance,
        duration: duration,
      };
    });
  }

  /* =====================================================
       DISPLAY MARKERS
    ====================================================== */

  function displayMarkers(from, to) {
    // Remove previous markers
    if (fromMarker) {
      map.removeLayer(fromMarker);
    }

    if (toMarker) {
      map.removeLayer(toMarker);
    }

    // Starting point marker
    fromMarker = L.marker([from.lat, from.lon], {
      icon: createMarkerIcon("from"),
    }).addTo(map);

    fromMarker.bindPopup(`
      <div class="popup-title">
        Starting Point
      </div>
      <div class="popup-value">
        ${escapeHTML(from.display)}
      </div>
    `);

    // Destination marker
    toMarker = L.marker([to.lat, to.lon], {
      icon: createMarkerIcon("to"),
    }).addTo(map);

    toMarker.bindPopup(`
      <div class="popup-title">
        Destination
      </div>
      <div class="popup-value">
        ${escapeHTML(to.display)}
      </div>
    `);
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
    // Remove previous route layers
    routeLayers.forEach(function (layer) {
      map.removeLayer(layer);
    });

    routeLayers = [];

    /*
     * GeoJSON uses [longitude, latitude].
     * Leaflet polylines use [latitude, longitude].
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

      // Clicking a route selects it
      layer.on("click", function () {
        selectRoute(index);
      });

      layer.bindTooltip(`Route ${index + 1}`, {
        sticky: true,
      });

      // Show distance and duration on the route
      layer.bindPopup(`
        <strong>${index === 0 ? "Best Route" : `Alternative ${index}`}</strong>
        <br>
        Distance: ${escapeHTML(formatDistance(route.distance))}
        <br>
        Estimated time: ${escapeHTML(formatDuration(route.duration))}
      `);

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

    // Update route cards
    const cards = document.querySelectorAll(".route-option");

    cards.forEach(function (card, index) {
      card.classList.toggle("selected", index === selectedIndex);
    });

    // Scroll the selected route into visibility
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
       * These traffic labels are demonstration placeholders.
       * They are not real-time traffic measurements.
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
            ${index === 0 ? "Best Route" : `Alternative ${index}`}
          </span>

          <span class="route-time">
            ${escapeHTML(duration)}
          </span>
        </div>

        <div class="route-option-details">
          <span class="route-dot"></span>

          <span>${escapeHTML(distance)}</span>

          <span>
            · ${Math.round(route.duration / 60)} min
          </span>

          <span class="route-traffic ${traffic.className}">
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
     * Demonstration logic only.
     *
     * Replace with actual congestion calculations
     * using vehicle counts, average speed, road occupancy,
     * or a congestion score when your traffic data is ready.
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
    // Remove route lines
    routeLayers.forEach(function (layer) {
      map.removeLayer(layer);
    });

    routeLayers = [];
    currentRoutes = [];

    // Remove markers
    if (fromMarker) {
      map.removeLayer(fromMarker);
      fromMarker = null;
    }

    if (toMarker) {
      map.removeLayer(toMarker);
      toMarker = null;
    }

    // Reset fields
    fromInput.value = "";
    toInput.value = "";

    // Reset results
    routeList.innerHTML = "";
    routeResults.hidden = true;
    routeStatus.hidden = true;

    // Return to city view
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
