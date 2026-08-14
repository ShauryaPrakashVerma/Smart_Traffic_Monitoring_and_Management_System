/* =========================================================
   DIGITAL TWIN
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const syncToggle = document.getElementById("syncToggle");

  const syncStatus = document.getElementById("syncStatus");

  const lastUpdate = document.getElementById("lastUpdate");

  const statusLatency = document.getElementById("statusLatency");

  const latencyMetric = document.getElementById("latencyMetric");

  const nodes = document.querySelectorAll(".dt-node");

  /* =================================================
           SYNC STATE
        ================================================= */

  let syncActive = true;

  let syncInterval = null;

  /* =================================================
           GENERATE LIVE VALUES
        ================================================= */

  function updateTwinData() {
    if (!syncActive) {
      return;
    }

    nodes.forEach(function (node) {
      const baseVehicles = Number(node.dataset.vehicles);

      const baseSpeed = Number(node.dataset.speed);

      /*
       * Small random variation
       * to simulate live data.
       */

      const vehicleVariation = Math.floor(Math.random() * 7) - 3;

      const speedVariation = Math.floor(Math.random() * 5) - 2;

      const vehicles = Math.max(0, baseVehicles + vehicleVariation);

      const speed = Math.max(0, baseSpeed + speedVariation);

      const data = node.querySelector(".node-data");

      if (data) {
        data.textContent = `${vehicles} veh · ${speed} km/h`;
      }
    });

    /*
     * Simulate latency.
     */

    const latency = 235 + Math.floor(Math.random() * 30);

    if (statusLatency) {
      statusLatency.textContent = `${latency}ms`;
    }

    if (latencyMetric) {
      latencyMetric.innerHTML = `${latency} <small>ms</small>`;
    }

    if (lastUpdate) {
      lastUpdate.textContent = "0.25s ago";
    }
  }

  /* =================================================
           START SYNC
        ================================================= */

  function startSync() {
    clearInterval(syncInterval);

    syncInterval = setInterval(updateTwinData, 1000);

    updateTwinData();
  }

  /* =================================================
           STOP SYNC
        ================================================= */

  function stopSync() {
    clearInterval(syncInterval);

    syncInterval = null;
  }

  /* =================================================
           TOGGLE SYNC
        ================================================= */

  function toggleSync() {
    syncActive = !syncActive;

    if (syncActive) {
      startSync();

      syncStatus.textContent = "SYNCING";

      syncStatus.classList.remove("paused");

      syncStatus.classList.add("active");

      syncToggle.textContent = "Pause Sync";
    } else {
      stopSync();

      syncStatus.textContent = "PAUSED";

      syncStatus.classList.remove("active");

      syncStatus.classList.add("paused");

      syncToggle.textContent = "Resume Sync";
    }
  }

  if (syncToggle) {
    syncToggle.addEventListener("click", function (event) {
      event.preventDefault();

      toggleSync();
    });
  }

  /* =================================================
           NODE INTERACTION
        ================================================= */

  nodes.forEach(function (node) {
    node.addEventListener("click", function () {
      const nodeId = node.dataset.node;

      const vehicles = node.dataset.vehicles;

      const speed = node.dataset.speed;

      /*
       * Highlight selected node.
       */

      nodes.forEach(function (otherNode) {
        otherNode.style.boxShadow = "";
      });

      node.style.boxShadow = "0 0 20px rgba(255,255,255,.28)";

      console.log(`Selected ${nodeId}: ${vehicles} vehicles, ${speed} km/h`);
    });
  });

  /* =================================================
           INITIALIZE
        ================================================= */

  startSync();
});
