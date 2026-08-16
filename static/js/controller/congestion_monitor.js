document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       DATA
    ====================================================== */

  const timeLabels = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  const congestionData = {
    A3: [8, 20, 72, 68, 42, 38, 50, 43, 38, 62, 82, 87, 82, 58],

    B2: [12, 30, 88, 82, 55, 48, 62, 55, 50, 70, 91, 98, 94, 66],

    B3: [6, 17, 51, 46, 30, 25, 39, 33, 28, 51, 68, 74, 70, 40],
  };

  const densityData = {
    A1: 18,
    A2: 52,
    A3: 74,
    B1: 41,
    B2: 89,
    B3: 68,
    C1: 12,
    C2: 38,
    C3: 14,
  };

  /* =====================================================
       DOM ELEMENTS
    ====================================================== */

  const lineCanvas = document.getElementById("congestionLineChart");

  const densityCanvas = document.getElementById("densityChart");

  const selectedZoneLabel = document.getElementById("selectedZoneLabel");

  const zoneCards = document.querySelectorAll(".zone-card");

  const resetChartBtn = document.getElementById("resetChartBtn");

  const exportDataBtn = document.getElementById("exportDataBtn");

  const toast = document.getElementById("congestionToast");

  let toastTimer;

  /* =====================================================
       CHART.JS CHECK
    ====================================================== */

  if (typeof Chart === "undefined") {
    console.error("Chart.js is not loaded.");

    return;
  }

  /* =====================================================
       CONGESTION LINE CHART
    ====================================================== */

  const lineCtx = lineCanvas.getContext("2d");

  const lineChart = new Chart(lineCtx, {
    type: "line",

    data: {
      labels: timeLabels,

      datasets: [
        {
          label: "A3 Interchange",

          data: congestionData.A3,

          borderColor: "#f15a24",

          backgroundColor: "rgba(241,90,36,0.05)",

          borderWidth: 2,

          pointRadius: 1.5,

          pointHoverRadius: 5,

          tension: 0.35,

          fill: false,
        },

        {
          label: "B2 Junction",

          data: congestionData.B2,

          borderColor: "#ef233c",

          backgroundColor: "rgba(239,35,60,0.05)",

          borderWidth: 2,

          pointRadius: 1.5,

          pointHoverRadius: 5,

          tension: 0.35,

          fill: false,
        },

        {
          label: "B3 Ramp",

          data: congestionData.B3,

          borderColor: "#d99000",

          backgroundColor: "rgba(217,144,0,0.05)",

          borderWidth: 2,

          pointRadius: 1.5,

          pointHoverRadius: 5,

          tension: 0.35,

          fill: false,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      interaction: {
        mode: "index",

        intersect: false,
      },

      plugins: {
        legend: {
          position: "bottom",

          labels: {
            boxWidth: 12,

            boxHeight: 2,

            padding: 12,

            font: {
              size: 8,
            },
          },
        },

        tooltip: {
          enabled: true,

          backgroundColor: "#101828",

          padding: 9,

          titleFont: {
            size: 9,
          },

          bodyFont: {
            size: 8,
          },

          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.y + "%";
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            color: "#f0f2f5",

            borderDash: [2, 4],
          },

          ticks: {
            color: "#98a2b3",

            font: {
              size: 8,
            },

            maxRotation: 0,
          },
        },

        y: {
          beginAtZero: true,

          max: 100,

          grid: {
            color: "#f0f2f5",

            borderDash: [2, 4],
          },

          ticks: {
            color: "#98a2b3",

            font: {
              size: 8,
            },

            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
    },
  });

  /* =====================================================
       CURRENT DENSITY BAR CHART
    ====================================================== */

  const densityCtx = densityCanvas.getContext("2d");

  const densityChart = new Chart(densityCtx, {
    type: "bar",

    data: {
      labels: Object.keys(densityData),

      datasets: [
        {
          label: "Congestion Index",

          data: Object.values(densityData),

          backgroundColor: "#101828",

          borderRadius: 2,

          barThickness: 10,
        },
      ],
    },

    options: {
      indexAxis: "y",

      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: "#101828",

          padding: 8,

          callbacks: {
            label: function (context) {
              return " Congestion: " + context.parsed.x + "%";
            },
          },
        },
      },

      scales: {
        x: {
          beginAtZero: true,

          max: 100,

          grid: {
            color: "#f0f2f5",

            borderDash: [2, 4],
          },

          ticks: {
            color: "#98a2b3",

            font: {
              size: 8,
            },

            callback: function (value) {
              return value + "%";
            },
          },
        },

        y: {
          grid: {
            display: false,
          },

          ticks: {
            color: "#667085",

            font: {
              size: 8,
            },
          },
        },
      },

      onClick: function (event, elements) {
        if (!elements.length) {
          return;
        }

        const index = elements[0].index;

        const zone = Object.keys(densityData)[index];

        const value = densityData[zone];

        showToast(`${zone} current congestion index: ${value}%`);

        highlightZoneCard(zone);
      },
    },
  });

  /* =====================================================
       ZONE CARD INTERACTION
    ====================================================== */

  zoneCards.forEach(function (card) {
    card.addEventListener("click", function () {
      zoneCards.forEach(function (item) {
        item.classList.remove("selected");
      });

      card.classList.add("selected");

      const zone = card.dataset.zone;

      const index = card.dataset.index;

      const vehicles = card.dataset.vehicles;

      selectedZoneLabel.textContent = `${zone} selected — congestion index ${index}% · ${vehicles} vehicles`;

      highlightLineChart(zone);

      showZoneModal(zone, index, vehicles);
    });
  });

  /* =====================================================
       HIGHLIGHT ZONE
    ====================================================== */

  function highlightLineChart(zone) {
    lineChart.data.datasets.forEach(function (dataset) {
      const datasetZone = dataset.label.split(" ")[0];

      if (datasetZone === zone) {
        dataset.borderWidth = 4;

        dataset.pointRadius = 3;

        dataset.hidden = false;
      } else {
        dataset.borderWidth = 1;

        dataset.pointRadius = 0;
      }
    });

    lineChart.update();
  }

  /* =====================================================
       RESET CHART
    ====================================================== */

  if (resetChartBtn) {
    resetChartBtn.addEventListener("click", function () {
      lineChart.data.datasets.forEach(function (dataset) {
        dataset.borderWidth = 2;

        dataset.pointRadius = 1.5;
      });

      lineChart.update();

      selectedZoneLabel.textContent = "Showing top congestion zones";

      zoneCards.forEach(function (card) {
        card.classList.remove("selected");
      });

      showToast("Congestion chart reset.");
    });
  }

  /* =====================================================
       ZONE MODAL
    ====================================================== */

  const zoneModal = document.getElementById("zoneModal");

  const closeZoneModal = document.getElementById("closeZoneModal");

  const modalZoneName = document.querySelector(".modal-zone-name");

  const modalZoneIndex = document.getElementById("modalZoneIndex");

  const modalZoneVehicles = document.getElementById("modalZoneVehicles");

  const modalZoneMessage = document.getElementById("modalZoneMessage");

  const viewZoneEventsBtn = document.getElementById("viewZoneEventsBtn");

  let currentModalZone = null;

  function showZoneModal(zone, index, vehicles) {
    currentModalZone = zone;

    modalZoneName.textContent = zone + " ZONE";

    modalZoneIndex.textContent = index + "%";

    modalZoneVehicles.textContent = vehicles + " vehicles detected";

    modalZoneMessage.textContent = getCongestionMessage(Number(index));

    zoneModal.hidden = false;
  }

  function closeModal() {
    zoneModal.hidden = true;
  }

  if (closeZoneModal) {
    closeZoneModal.addEventListener("click", closeModal);
  }

  if (zoneModal) {
    zoneModal.addEventListener("click", function (event) {
      if (event.target === zoneModal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !zoneModal.hidden) {
      closeModal();
    }
  });

  function getCongestionMessage(index) {
    if (index >= 85) {
      return `
                Severe congestion detected.
                Traffic is approaching standstill conditions.
                Immediate traffic management may be required.
            `;
    }

    if (index >= 65) {
      return `
                Heavy congestion is currently present.
                Average vehicle speeds are significantly reduced.
            `;
    }

    if (index >= 40) {
      return `
                Moderate congestion detected.
                Traffic is moving but delays may be developing.
            `;
    }

    return `
            Traffic is currently flowing relatively freely
            with limited congestion.
        `;
  }

  if (viewZoneEventsBtn) {
    viewZoneEventsBtn.addEventListener("click", function () {
      closeModal();

      filterEventsByZone(currentModalZone);

      showToast(`Showing congestion events for ${currentModalZone}.`);
    });
  }

  /* =====================================================
       EVENT FILTERS
    ====================================================== */

  const eventFilters = document.querySelectorAll(".event-filter");

  const eventRows = document.querySelectorAll("#eventTableBody tr");

  const eventCount = document.getElementById("eventCount");

  eventFilters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      eventFilters.forEach(function (item) {
        item.classList.remove("active");
      });

      filter.classList.add("active");

      const status = filter.dataset.status;

      let visibleCount = 0;

      eventRows.forEach(function (row) {
        if (status === "ALL" || row.dataset.status === status) {
          row.classList.remove("hidden-row");

          visibleCount++;
        } else {
          row.classList.add("hidden-row");
        }
      });

      eventCount.textContent = `${visibleCount} events`;
    });
  });

  /* =====================================================
       FILTER EVENTS BY ZONE
    ====================================================== */

  function filterEventsByZone(zone) {
    eventRows.forEach(function (row) {
      if (row.dataset.zone === zone) {
        row.classList.remove("hidden-row");

        row.classList.add("selected");
      } else {
        row.classList.add("hidden-row");

        row.classList.remove("selected");
      }
    });

    eventFilters.forEach(function (filter) {
      filter.classList.remove("active");
    });

    eventCount.textContent = `${
      document.querySelectorAll("#eventTableBody tr:not(.hidden-row)").length
    } events`;
  }

  /* =====================================================
       EVENT ROW INTERACTION
    ====================================================== */

  eventRows.forEach(function (row) {
    row.addEventListener("click", function () {
      eventRows.forEach(function (item) {
        item.classList.remove("selected");
      });

      row.classList.add("selected");

      const zone = row.dataset.zone;

      highlightZoneCard(zone);

      showToast(`Selected congestion event at ${zone}.`);
    });
  });

  /* =====================================================
       HIGHLIGHT ZONE CARD
    ====================================================== */

  function highlightZoneCard(zone) {
    zoneCards.forEach(function (card) {
      card.classList.remove("selected");

      if (card.dataset.zone === zone) {
        card.classList.add("selected");
      }
    });
  }

  /* =====================================================
       EXPORT DATA
    ====================================================== */

  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", function () {
      const headers = [
        "Time",
        "Zone",
        "Congestion Index",
        "Vehicles",
        "Average Speed",
        "Duration",
        "Status",
      ];

      const rows = [
        ["17:42", "B2", "98%", "89", "8 km/h", "52 min", "ACTIVE"],

        ["17:15", "A3", "87%", "67", "24 km/h", "37 min", "ACTIVE"],

        ["16:50", "B3", "74%", "55", "19 km/h", "48 min", "ACTIVE"],

        ["16:10", "A2", "68%", "52", "28 km/h", "35 min", "CLEARING"],

        ["15:30", "C2", "45%", "38", "35 km/h", "22 min", "RESOLVED"],
      ];

      const csv = [headers, ...rows]
        .map((row) => row.map((value) => `"${value}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "congestion_events.csv";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      showToast("Congestion data exported successfully.");
    });
  }

  /* =====================================================
       TOAST
    ====================================================== */

  function showToast(message) {
    if (!toast) {
      return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }
});
