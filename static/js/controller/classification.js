document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       CLASS DISTRIBUTION — DOUGHNUT
    ===================================================== */

  const distributionCanvas = document.getElementById("classDistributionChart");

  const distributionContext = distributionCanvas.getContext("2d");

  new Chart(distributionContext, {
    type: "doughnut",

    data: {
      labels: ["Cars", "Motorcycles", "Trucks", "Buses", "Vans", "Emergency"],

      datasets: [
        {
          data: [
            68,

            12,

            10,

            6,

            3,

            1,
          ],

          backgroundColor: [
            "#111827",

            "#6b7280",

            "#374151",

            "#9ca3af",

            "#d1d5db",

            "#ef4444",
          ],

          borderColor: "#ffffff",

          borderWidth: 1,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      cutout: "0%",

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          callbacks: {
            label: function (context) {
              return " " + context.label + ": " + context.parsed + "%";
            },
          },
        },
      },
    },
  });

  /* =====================================================
       ZONE BREAKDOWN — STACKED BAR
    ===================================================== */

  const zoneCanvas = document.getElementById("zoneBreakdownChart");

  const zoneContext = zoneCanvas.getContext("2d");

  new Chart(zoneContext, {
    type: "bar",

    data: {
      labels: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],

      datasets: [
        /* Cars */

        {
          label: "Cars",

          data: [7, 21, 45, 17, 58, 37, 5, 20, 9],

          backgroundColor: "#111827",

          borderWidth: 0,
        },

        /* Trucks */

        {
          label: "Trucks",

          data: [1, 4, 7, 3, 9, 6, 1, 4, 2],

          backgroundColor: "#6b7280",

          borderWidth: 0,
        },

        /* Motorcycles */

        {
          label: "Motorcycles",

          data: [1, 5, 8, 4, 11, 7, 1, 5, 2],

          backgroundColor: "#d1d5db",

          borderWidth: 0,
        },

        /* Buses */

        {
          label: "Buses",

          data: [1, 3, 5, 2, 6, 4, 1, 2, 1],

          backgroundColor: "#9ca3af",

          borderWidth: 0,
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
            color: "#9ca3af",

            font: {
              size: 10,
            },

            boxWidth: 14,

            boxHeight: 8,

            padding: 15,
          },
        },
      },

      scales: {
        x: {
          stacked: true,

          grid: {
            display: false,
          },

          ticks: {
            color: "#9ca3af",

            font: {
              size: 9,
            },
          },

          border: {
            display: false,
          },
        },

        y: {
          stacked: true,

          beginAtZero: true,

          max: 100,

          ticks: {
            stepSize: 25,

            color: "#9ca3af",

            font: {
              size: 9,
            },
          },

          grid: {
            color: "#eef0f2",
          },

          border: {
            display: false,
          },
        },
      },
    },
  });

  /* =====================================================
       ACCURACY CARD INTERACTION
    ===================================================== */

  const accuracyCards = document.querySelectorAll(".accuracy-card");

  accuracyCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 3px 10px rgba(15,23,42,.06)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none";
    });
  });
});
