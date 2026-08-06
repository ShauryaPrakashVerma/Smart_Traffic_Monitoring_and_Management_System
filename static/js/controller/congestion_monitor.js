new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: [
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
    ],
    datasets: [
      {
        label: "A3",
        data: [10, 25, 75, 70, 40, 35, 52, 45, 38, 60, 80, 88, 82, 55],
        borderColor: "#f97316",
      },
      {
        label: "B2",
        data: [12, 35, 88, 82, 55, 48, 62, 56, 51, 74, 92, 98, 90, 66],
        borderColor: "#ef4444",
      },
      {
        label: "B3",
        data: [5, 15, 52, 48, 30, 25, 40, 34, 28, 48, 65, 73, 66, 40],
        borderColor: "#d97706",
      },
    ],
  },
  options: { responsive: true },
});
new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"],
    datasets: [{ data: [18, 52, 74, 41, 92, 69, 12, 38, 21] }],
  },
  options: {
    indexAxis: "y",
    plugins: { legend: { display: false } },
    responsive: true,
  },
});
