document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       HISTORICAL DATA
    ===================================================== */

  const historyData = {
    7: [
      {
        date: "Jul 28",
        vehicles: 38241,
        incidents: 4,
        speed: 37,
        peakVolume: 688,
        peakTime: "17:00–18:00",
        congestion: "MED",
      },
      {
        date: "Jul 29",
        vehicles: 41032,
        incidents: 6,
        speed: 34,
        peakVolume: 739,
        peakTime: "17:00–18:00",
        congestion: "HIGH",
      },
      {
        date: "Jul 30",
        vehicles: 39847,
        incidents: 3,
        speed: 38,
        peakVolume: 717,
        peakTime: "17:00–18:00",
        congestion: "LOW",
      },
      {
        date: "Jul 31",
        vehicles: 42611,
        incidents: 7,
        speed: 31,
        peakVolume: 767,
        peakTime: "17:00–18:00",
        congestion: "HIGH",
      },
      {
        date: "Aug 01",
        vehicles: 44102,
        incidents: 5,
        speed: 33,
        peakVolume: 794,
        peakTime: "17:00–18:00",
        congestion: "MED",
      },
      {
        date: "Aug 02",
        vehicles: 40583,
        incidents: 2,
        speed: 40,
        peakVolume: 730,
        peakTime: "17:00–18:00",
        congestion: "LOW",
      },
      {
        date: "Aug 03",
        vehicles: 41294,
        incidents: 3,
        speed: 37,
        peakVolume: 743,
        peakTime: "17:00–18:00",
        congestion: "LOW",
      },
    ],
  };

  /* =====================================================
       CHART REFERENCES
    ===================================================== */

  let vehicleChart;
  let incidentSpeedChart;

  /* =====================================================
       CHART CONFIG
    ===================================================== */

  function createCharts(data) {
    const labels = data.map((item) => item.date);

    const vehicleValues = data.map((item) => item.vehicles);

    const incidents = data.map((item) => item.incidents);

    const speeds = data.map((item) => item.speed);

    /* -------------------------------------------------
           VEHICLE COUNT CHART
        ------------------------------------------------- */

    const vehicleCanvas = document.getElementById("vehicleCountChart");

    if (vehicleChart) {
      vehicleChart.destroy();
    }

    vehicleChart = new Chart(vehicleCanvas, {
      type: "bar",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Vehicles",

            data: vehicleValues,

            backgroundColor: "#111827",

            borderRadius: 2,

            maxBarThickness: 23,
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
            backgroundColor: "#111827",

            padding: 10,

            callbacks: {
              title: function (items) {
                return items[0].label;
              },

              label: function (context) {
                return " Vehicles: " + context.raw.toLocaleString();
              },
            },
          },
        },

        scales: {
          y: {
            beginAtZero: true,

            grid: {
              color: "#edf0f3",
            },

            ticks: {
              color: "#94a3b8",

              font: {
                size: 10,
              },

              callback: function (value) {
                return value / 1000 + "k";
              },
            },
          },

          x: {
            grid: {
              display: false,
            },

            ticks: {
              color: "#94a3b8",

              font: {
                size: 10,
              },
            },
          },
        },
      },
    });

    /* -------------------------------------------------
           INCIDENTS + SPEED CHART
        ------------------------------------------------- */

    const incidentCanvas = document.getElementById("incidentSpeedChart");

    if (incidentSpeedChart) {
      incidentSpeedChart.destroy();
    }

    incidentSpeedChart = new Chart(incidentCanvas, {
      type: "line",

      data: {
        labels: labels,

        datasets: [
          {
            label: "Avg Speed",

            data: speeds,

            borderColor: "#d99100",

            backgroundColor: "transparent",

            borderWidth: 2,

            tension: 0.35,

            pointRadius: 4,

            pointHoverRadius: 6,

            pointBackgroundColor: "#d99100",

            yAxisID: "speedAxis",
          },

          {
            label: "Incidents",

            data: incidents,

            borderColor: "#ef2b2b",

            backgroundColor: "transparent",

            borderWidth: 2,

            tension: 0.35,

            pointRadius: 4,

            pointHoverRadius: 6,

            pointBackgroundColor: "#ef2b2b",

            yAxisID: "incidentAxis",
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
              usePointStyle: true,

              pointStyle: "line",

              boxWidth: 20,

              color: "#64748b",

              font: {
                size: 10,
              },
            },
          },

          tooltip: {
            backgroundColor: "#111827",

            padding: 10,

            callbacks: {
              label: function (context) {
                if (context.dataset.label === "Avg Speed") {
                  return " Avg Speed: " + context.raw + " km/h";
                }

                return " Incidents: " + context.raw;
              },
            },
          },
        },

        scales: {
          speedAxis: {
            position: "right",

            beginAtZero: true,

            suggestedMax: 45,

            grid: {
              drawOnChartArea: false,
            },

            ticks: {
              color: "#94a3b8",

              font: {
                size: 10,
              },

              callback: function (value) {
                return value;
              },
            },
          },

          incidentAxis: {
            position: "left",

            beginAtZero: true,

            suggestedMax: 8,

            grid: {
              color: "#edf0f3",
            },

            ticks: {
              color: "#94a3b8",

              font: {
                size: 10,
              },
            },
          },

          x: {
            grid: {
              color: "#edf0f3",
            },

            ticks: {
              color: "#94a3b8",

              font: {
                size: 10,
              },
            },
          },
        },
      },
    });
  }

  /* =====================================================
       TABLE
    ===================================================== */

  function renderTable(data) {
    const tbody = document.getElementById("historicalTableBody");

    tbody.innerHTML = "";

    data.forEach((item) => {
      const row = document.createElement("tr");

      let congestionClass = "";

      if (item.congestion === "LOW") {
        congestionClass = "congestion-low";
      } else if (item.congestion === "MED") {
        congestionClass = "congestion-med";
      } else {
        congestionClass = "congestion-high";
      }

      row.innerHTML = `

                <td class="history-date">
                    ${item.date}
                </td>

                <td>
                    ${item.vehicles.toLocaleString()}
                </td>

                <td class="history-incidents">
                    ${item.incidents}
                </td>

                <td class="history-speed">
                    ${item.speed} km/h
                </td>

                <td class="history-peak">
                    ${item.peakVolume}/h
                </td>

                <td>
                    ${item.peakTime}
                </td>

                <td>
                    <span class="congestion-badge ${congestionClass}">
                        ${item.congestion}
                    </span>
                </td>

            `;

      tbody.appendChild(row);
    });

    document.getElementById("recordCount").textContent =
      `Showing ${data.length} records`;
  }

  /* =====================================================
       FILTER BUTTONS
    ===================================================== */

  document.querySelectorAll(".history-filter").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".history-filter").forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

      const days = this.dataset.days;

      let data = historyData["7"];

      /*
       * For now the demo uses the same base dataset.
       * Later you can replace this with a Flask API
       * request for 30d / 90d / 1y.
       */

      if (historyData[days]) {
        data = historyData[days];
      }

      createCharts(data);

      renderTable(data);
    });
  });

  /* =====================================================
       CSV EXPORT
    ===================================================== */

  document
    .getElementById("exportHistoryBtn")
    .addEventListener("click", function () {
      const data = historyData["7"];

      let csv =
        "Date,Total Vehicles,Incidents,Avg Speed,Peak Volume,Peak Time,Congestion Index\n";

      data.forEach((item) => {
        csv +=
          `${item.date},` +
          `${item.vehicles},` +
          `${item.incidents},` +
          `${item.speed},` +
          `${item.peakVolume},` +
          `"${item.peakTime}",` +
          `${item.congestion}\n`;
      });

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "traffic_historical_records.csv";

      link.click();

      URL.revokeObjectURL(url);
    });

  /* =====================================================
       INITIAL RENDER
    ===================================================== */

  const initialData = historyData["7"];

  createCharts(initialData);

  renderTable(initialData);
});
