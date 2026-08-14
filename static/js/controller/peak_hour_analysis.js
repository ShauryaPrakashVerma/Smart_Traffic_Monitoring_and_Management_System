document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
           DATA
        ====================================================== */

  const hours = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
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
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  const hourlyVolume = [
    42, 25, 18, 15, 22, 62, 128, 320, 587, 520, 398, 365, 440, 400, 375, 500,
    620, 698, 610, 430, 300, 215, 145, 90,
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const lastWeek = [510, 545, 530, 590, 610, 420, 350];

  const thisWeek = [560, 580, 590, 620, 675, 450, 390];

  const zoneData = [
    {
      name: "A1",
      value: 94,
      severity: "low",
    },

    {
      name: "A2",
      value: 265,
      severity: "medium",
    },

    {
      name: "A3",
      value: 523,
      severity: "high",
    },

    {
      name: "B1",
      value: 218,
      severity: "medium",
    },

    {
      name: "B2",
      value: 694,
      severity: "critical",
    },

    {
      name: "B3",
      value: 429,
      severity: "high",
    },

    {
      name: "C1",
      value: 70,
      severity: "low",
    },

    {
      name: "C2",
      value: 242,
      severity: "medium",
    },

    {
      name: "C3",
      value: 109,
      severity: "low",
    },
  ];

  /* =====================================================
           ZONE CARDS
        ====================================================== */

  const zoneContainer = document.getElementById("zoneBreakdown");

  zoneData.forEach((zone) => {
    const card = document.createElement("div");

    card.className = `zone-card ${zone.severity}`;

    card.innerHTML = `

                <span class="zone-name">
                    ${zone.name}
                </span>

                <span class="zone-value">
                    ${zone.value}
                </span>

                <span class="zone-unit">
                    veh/h
                </span>

            `;

    zoneContainer.appendChild(card);
  });

  /* =====================================================
           CHART DEFAULTS
        ====================================================== */

  Chart.defaults.font.family = "Inter, Arial, sans-serif";

  Chart.defaults.font.size = 9;

  Chart.defaults.color = "#94a3b8";

  /* =====================================================
           24-HOUR VOLUME CHART
        ====================================================== */

  const volumeCanvas = document.getElementById("volumeChart");

  const volumeContext = volumeCanvas.getContext("2d");

  /* Gradient */

  const volumeGradient = volumeContext.createLinearGradient(0, 0, 0, 220);

  volumeGradient.addColorStop(0, "rgba(15, 23, 42, 0.15)");

  volumeGradient.addColorStop(1, "rgba(15, 23, 42, 0.01)");

  const volumeChart = new Chart(volumeContext, {
    type: "line",

    data: {
      labels: hours,

      datasets: [
        {
          label: "Vehicles / hour",

          data: hourlyVolume,

          borderColor: "#111827",

          backgroundColor: volumeGradient,

          borderWidth: 2,

          fill: true,

          tension: 0.35,

          pointRadius: 0,

          pointHoverRadius: 5,

          pointHoverBackgroundColor: "#111827",

          pointHoverBorderColor: "#ffffff",

          pointHoverBorderWidth: 2,
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
          display: false,
        },

        tooltip: {
          enabled: true,

          backgroundColor: "#ffffff",

          titleColor: "#111827",

          bodyColor: "#475569",

          borderColor: "#dfe3e8",

          borderWidth: 1,

          padding: 10,

          displayColors: false,

          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },

            label: function (context) {
              return "Vehicles/h: " + context.parsed.y;
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            color: "rgba(148,163,184,0.12)",

            drawTicks: false,
          },

          ticks: {
            maxRotation: 0,

            autoSkip: false,

            callback: function (value, index) {
              /*
               * Show every
               * hour on desktop,
               * but reduce labels
               * on small screens.
               */

              if (window.innerWidth < 700) {
                return index % 3 === 0 ? hours[index] : "";
              }

              return hours[index];
            },
          },
        },

        y: {
          beginAtZero: true,

          max: 800,

          grid: {
            color: "rgba(148,163,184,0.12)",

            borderDash: [2, 3],
          },

          ticks: {
            stepSize: 200,
          },
        },
      },
    },
  });

  /* =====================================================
           7-DAY RADAR CHART
        ====================================================== */

  const radarCanvas = document.getElementById("dailyPeakChart");

  const radarContext = radarCanvas.getContext("2d");

  const radarChart = new Chart(radarContext, {
    type: "radar",

    data: {
      labels: days,

      datasets: [
        {
          label: "Last Week",

          data: lastWeek,

          borderColor: "#9ca3af",

          backgroundColor: "rgba(156,163,175,0.16)",

          borderWidth: 1.5,

          pointRadius: 2,

          pointHoverRadius: 5,
        },

        {
          label: "This Week",

          data: thisWeek,

          borderColor: "#111827",

          backgroundColor: "rgba(15,23,42,0.10)",

          borderWidth: 2,

          pointRadius: 2,

          pointHoverRadius: 5,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: "bottom",

          labels: {
            boxWidth: 12,

            boxHeight: 12,

            padding: 10,

            font: {
              size: 9,
            },
          },
        },

        tooltip: {
          enabled: true,

          backgroundColor: "#ffffff",

          titleColor: "#111827",

          bodyColor: "#475569",

          borderColor: "#dfe3e8",

          borderWidth: 1,

          padding: 10,

          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },

            label: function (context) {
              return context.dataset.label + ": " + context.parsed.r;
            },
          },
        },
      },

      scales: {
        r: {
          beginAtZero: true,

          max: 800,

          ticks: {
            display: false,
          },

          grid: {
            color: "rgba(148,163,184,0.28)",
          },

          angleLines: {
            color: "rgba(148,163,184,0.25)",
          },

          pointLabels: {
            color: "#94a3b8",

            font: {
              size: 9,
            },
          },
        },
      },
    },
  });

  /* =====================================================
           PERIOD BUTTON
        ====================================================== */

  const periodButton = document.getElementById("periodButton");

  periodButton.addEventListener("click", function () {
    if (this.textContent.trim() === "Last 7 Days") {
      this.textContent = "Today";

      this.classList.add("active");
    } else {
      this.textContent = "Last 7 Days";

      this.classList.remove("active");
    }
  });

  /* =====================================================
           EXPORT
        ====================================================== */

  const exportButton = document.getElementById("exportButton");

  exportButton.addEventListener("click", function () {
    const report = {
      generatedAt: new Date().toISOString(),

      morningPeak: "07:00-09:00",

      eveningPeak: "16:30-18:30",

      offPeakAverage: 187,

      peakRatio: "3.7x",

      worstSegment: "B2 - 17:00",

      zones: zoneData,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "peak-hour-analysis.json";

    link.click();

    URL.revokeObjectURL(url);
  });

  /* =====================================================
           RESIZE CHART
        ====================================================== */

  window.addEventListener("resize", function () {
    volumeChart.resize();

    radarChart.resize();
  });
});
