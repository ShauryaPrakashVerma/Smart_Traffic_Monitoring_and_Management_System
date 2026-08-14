document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       SAMPLE DETECTION DATA
    ===================================================== */

  const detectionData = [
    {
      timestamp: "17:43:21",
      camera: "CAM-03",
      type: "Car",
      id: "VEH-4821",
      speed: 12,
      confidence: 97,
      zone: "B2",
    },

    {
      timestamp: "17:43:19",
      camera: "CAM-02",
      type: "Truck",
      id: "VEH-4820",
      speed: 28,
      confidence: 91,
      zone: "A3",
    },

    {
      timestamp: "17:43:17",
      camera: "CAM-03",
      type: "Car",
      id: "VEH-4819",
      speed: 9,
      confidence: 95,
      zone: "B2",
    },

    {
      timestamp: "17:43:14",
      camera: "CAM-04",
      type: "Motorcycle",
      id: "VEH-4818",
      speed: 35,
      confidence: 88,
      zone: "B3",
    },

    {
      timestamp: "17:43:11",
      camera: "CAM-01",
      type: "Bus",
      id: "VEH-4817",
      speed: 22,
      confidence: 93,
      zone: "A2",
    },

    {
      timestamp: "17:43:09",
      camera: "CAM-03",
      type: "Car",
      id: "VEH-4816",
      speed: 7,
      confidence: 98,
      zone: "B2",
    },

    {
      timestamp: "17:43:06",
      camera: "CAM-05",
      type: "Car",
      id: "VEH-4815",
      speed: 48,
      confidence: 96,
      zone: "C1",
    },

    {
      timestamp: "17:43:04",
      camera: "CAM-06",
      type: "Truck",
      id: "VEH-4814",
      speed: 31,
      confidence: 90,
      zone: "C2",
    },

    {
      timestamp: "17:43:01",
      camera: "CAM-02",
      type: "Car",
      id: "VEH-4813",
      speed: 26,
      confidence: 94,
      zone: "A3",
    },

    {
      timestamp: "17:42:58",
      camera: "CAM-03",
      type: "Van",
      id: "VEH-4812",
      speed: 11,
      confidence: 87,
      zone: "B2",
    },
  ];

  /* =====================================================
       TABLE
    ===================================================== */

  const tableBody = document.getElementById("detectionTableBody");

  function getSpeedClass(speed) {
    if (speed < 15) {
      return "speed-low";
    }

    if (speed < 30) {
      return "speed-medium";
    }

    return "speed-high";
  }

  function getConfidenceClass(confidence) {
    if (confidence >= 93) {
      return "confidence-high";
    }

    if (confidence >= 90) {
      return "confidence-medium";
    }

    return "confidence-low";
  }

  function renderTable() {
    tableBody.innerHTML = "";

    detectionData.forEach((detection) => {
      const row = document.createElement("tr");

      row.innerHTML = `

                <td>
                    ${detection.timestamp}
                </td>

                <td>
                    ${detection.camera}
                </td>

                <td>
                    <strong>
                        ${detection.type}
                    </strong>
                </td>

                <td class="vehicle-id">
                    ${detection.id}
                </td>

                <td class="${getSpeedClass(detection.speed)}">
                    ${detection.speed} km/h
                </td>

                <td class="${getConfidenceClass(detection.confidence)}">
                    ${detection.confidence}%
                </td>

                <td>
                    ${detection.zone}
                </td>

            `;

      tableBody.appendChild(row);
    });
  }

  renderTable();

  /* =====================================================
       DETECTION RATE CHART
    ===================================================== */

  const chartCanvas = document.getElementById("detectionRateChart");

  const chartContext = chartCanvas.getContext("2d");

  const detectionChart = new Chart(chartContext, {
    type: "line",

    data: {
      labels: ["17:40", "17:41", "17:42", "17:43", "17:44"],

      datasets: [
        {
          data: [28, 31, 34, 29, 32],

          borderColor: "#111827",

          backgroundColor: "rgba(17,24,39,0.05)",

          borderWidth: 2,

          pointRadius: 0,

          pointHoverRadius: 4,

          fill: true,

          tension: 0.35,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          displayColors: false,

          callbacks: {
            label: function (context) {
              return context.parsed.y + " veh/min";
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            color: "#eef0f2",
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
          min: 0,

          max: 36,

          ticks: {
            stepSize: 9,

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
       SIMULATE LIVE DETECTIONS
    ===================================================== */

  const cameras = ["CAM-01", "CAM-02", "CAM-03", "CAM-04", "CAM-05", "CAM-06"];

  const vehicleTypes = ["Car", "Truck", "Motorcycle", "Bus", "Van"];

  const zones = ["A2", "A3", "B2", "B3", "C1", "C2"];

  let vehicleNumber = 4822;

  function getCurrentTime() {
    const now = new Date();

    return now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function addLiveDetection() {
    const detection = {
      timestamp: getCurrentTime(),

      camera: randomItem(cameras),

      type: randomItem(vehicleTypes),

      id: `VEH-${vehicleNumber++}`,

      speed: Math.floor(Math.random() * 45) + 5,

      confidence: Math.floor(Math.random() * 13) + 86,

      zone: randomItem(zones),
    };

    detectionData.unshift(detection);

    if (detectionData.length > 10) {
      detectionData.pop();
    }

    renderTable();

    updateStatistics(detection);
  }

  /* =====================================================
       UPDATE KPI VALUES
    ===================================================== */

  function updateStatistics(detection) {
    const detectionRate = document.getElementById("detectionRate");

    const todayDetections = document.getElementById("todayDetections");

    const latency = document.getElementById("modelLatency");

    const confidence = document.getElementById("avgConfidence");

    const currentRate = parseInt(detectionRate.textContent);

    detectionRate.textContent = Math.max(
      20,
      Math.min(38, currentRate + (Math.random() > 0.5 ? 1 : -1)),
    );

    const currentDetections = parseInt(
      todayDetections.textContent.replace(/,/g, ""),
    );

    todayDetections.textContent = (currentDetections + 1).toLocaleString();

    latency.textContent = Math.floor(Math.random() * 8) + 24;

    confidence.textContent = (91 + Math.random() * 5).toFixed(1);

    /* ===============================================
           UPDATE CHART
        =============================================== */

    const dataset = detectionChart.data.datasets[0];

    const newValue = parseInt(detectionRate.textContent);

    dataset.data.shift();

    dataset.data.push(newValue);

    detectionChart.update("none");
  }

  /* =====================================================
       RUN LIVE SIMULATION
    ===================================================== */

  setInterval(addLiveDetection, 4000);

  /* =====================================================
       CONFIGURE MODEL
    ===================================================== */

  const configureButton = document.getElementById("configureModelBtn");

  configureButton.addEventListener("click", function () {
    alert(
      "YOLO v8.1 model configuration panel will be connected to the backend here.",
    );
  });
});
