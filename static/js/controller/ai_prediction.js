document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
           FORECAST CHART
        ====================================================== */

  const canvas = document.getElementById("forecastChart");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");

  const labels = [
    "16:00",
    "16:15",
    "16:30",
    "16:45",
    "17:00",
    "17:15",
    "17:30",
    "17:45",
    "18:00",
    "18:15",
    "18:30",
    "18:45",
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",
  ];

  const actualData = [
    620,
    650,
    680,
    705,
    710,
    680,
    620,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  const predictedData = [
    620, 650, 675, 700, 705, 680, 620, 590, 560, 525, 490, 450, 420, 390, 350,
    320, 300,
  ];

  const forecastChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "Actual",

          data: actualData,

          borderColor: "#101828",

          backgroundColor: "rgba(16,24,40,0.05)",

          borderWidth: 2,

          pointRadius: 2,

          pointHoverRadius: 6,

          tension: 0.35,

          fill: true,
        },

        {
          label: "Predicted",

          data: predictedData,

          borderColor: "#98a2b3",

          borderDash: [5, 4],

          backgroundColor: "transparent",

          borderWidth: 2,

          pointRadius: 2,

          pointHoverRadius: 6,

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
            boxWidth: 20,

            padding: 14,

            font: {
              size: 10,
            },
          },
        },

        tooltip: {
          enabled: true,

          backgroundColor: "#101828",

          padding: 10,

          titleFont: {
            size: 11,
          },

          bodyFont: {
            size: 10,
          },

          callbacks: {
            label: function (context) {
              const value = context.parsed.y;

              if (value === null || value === undefined) {
                return `${context.dataset.label}: —`;
              }

              return `${context.dataset.label}: ${value} vehicles/h`;
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            color: "#edf0f3",

            borderDash: [2, 4],
          },

          ticks: {
            color: "#98a2b3",

            font: {
              size: 9,
            },

            maxRotation: 0,
          },
        },

        y: {
          beginAtZero: true,

          suggestedMax: 800,

          grid: {
            color: "#edf0f3",

            borderDash: [2, 4],
          },

          ticks: {
            color: "#98a2b3",

            font: {
              size: 9,
            },
          },
        },
      },
    },
  });

  /* =====================================================
           APPLY RECOMMENDATIONS
        ====================================================== */

  const applyButtons = document.querySelectorAll(".apply-btn");

  applyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const recommendation = button.closest(".recommendation");

      if (!recommendation) {
        return;
      }

      const text = recommendation.dataset.recommendation;

      /*
       * Prevent applying twice.
       */

      if (button.classList.contains("applied")) {
        return;
      }

      button.textContent = "Applied";

      button.classList.add("applied");

      showToast(`AI recommendation applied: ${text}`);
    });
  });

  /* =====================================================
           RETRAIN MODEL
        ====================================================== */

  const retrainBtn = document.getElementById("retrainBtn");

  const modelStatus = document.getElementById("modelStatus");

  const modelVersion = document.getElementById("modelVersion");

  const lastRetrained = document.getElementById("lastRetrained");

  if (retrainBtn) {
    retrainBtn.addEventListener("click", function () {
      /*
       * Prevent repeated clicks.
       */

      if (retrainBtn.disabled) {
        return;
      }

      retrainBtn.disabled = true;

      retrainBtn.textContent = "Retraining...";

      modelStatus.textContent = "RETRAINING MODEL";

      modelStatus.classList.add("training");

      showToast("Model retraining started...");

      /*
       * Simulate model training.
       */

      setTimeout(function () {
        modelVersion.textContent = "v4.3";

        modelStatus.textContent = "MODEL V4.3 • LSTM";

        modelStatus.classList.remove("training");

        lastRetrained.textContent = "Just now";

        retrainBtn.textContent = "Retrain Model";

        retrainBtn.disabled = false;

        showToast("Model retrained successfully — v4.3 is now active.");
      }, 3000);
    });
  }

  /* =====================================================
           ZONE INTERACTION
        ====================================================== */

  const zoneRows = document.querySelectorAll(".zone-row");

  zoneRows.forEach(function (row) {
    row.addEventListener("click", function () {
      zoneRows.forEach(function (item) {
        item.classList.remove("selected");
      });

      row.classList.add("selected");

      const zone = row.dataset.zone;

      const value = row.dataset.value;

      showToast(`${zone} predicted congestion: ${value}%`);
    });
  });

  /* =====================================================
           FEATURE IMPORTANCE INTERACTION
        ====================================================== */

  const featureRows = document.querySelectorAll(".feature-row");

  featureRows.forEach(function (row) {
    row.addEventListener("click", function () {
      featureRows.forEach(function (item) {
        item.classList.remove("selected");
      });

      row.classList.add("selected");

      const feature = row.dataset.feature;

      const value = row.dataset.value;

      showToast(`${feature} contributes ${value}% to the prediction`);
    });
  });

  /* =====================================================
           TOAST
        ====================================================== */

  const toast = document.getElementById("aiToast");

  let toastTimer;

  function showToast(message) {
    if (!toast) {
      return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2800);
  }

  /* =====================================================
           CHART HOVER EVENT
        ====================================================== */

  canvas.addEventListener("mousemove", function () {
    /*
     * Chart.js handles the actual
     * tooltip interaction.
     */
  });
});
