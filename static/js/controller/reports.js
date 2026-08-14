document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ===================================================== */

  const reportTypeButtons = document.querySelectorAll(".report-type");

  const customDateRange = document.getElementById("customDateRange");

  const generateButton = document.getElementById("generateReportBtn");

  const generateText = document.getElementById("generateText");

  const reportStatus = document.getElementById("reportStatus");

  const recentReportsList = document.getElementById("recentReportsList");

  /* =====================================================
       REPORT TYPE SELECTION
    ===================================================== */

  reportTypeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      reportTypeButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

      const selectedType = this.dataset.type;

      /* Show custom date picker */

      if (selectedType === "Custom") {
        customDateRange.style.display = "flex";
      } else {
        customDateRange.style.display = "none";
      }
    });
  });

  /* =====================================================
       GET SELECTED REPORT TYPE
    ===================================================== */

  function getReportType() {
    const activeButton = document.querySelector(".report-type.active");

    return activeButton ? activeButton.dataset.type : "Daily";
  }

  /* =====================================================
       GET SELECTED OPTIONS
    ===================================================== */

  function getSelectedOptions() {
    const checkboxes = document.querySelectorAll(
      ".report-checkbox input:checked",
    );

    return Array.from(checkboxes).map((input) => input.value);
  }

  /* =====================================================
       GENERATE REPORT
    ===================================================== */

  generateButton.addEventListener("click", function () {
    const reportType = getReportType();

    const selectedOptions = getSelectedOptions();

    /* Validate */

    if (selectedOptions.length === 0) {
      showStatus("Please select at least one report section.", "error");

      return;
    }

    /* Custom date validation */

    if (reportType === "Custom") {
      const start = document.getElementById("startDate").value;

      const end = document.getElementById("endDate").value;

      if (!start || !end) {
        showStatus("Please select both start and end dates.", "error");

        return;
      }

      if (start > end) {
        showStatus("End date must be after the start date.", "error");

        return;
      }
    }

    /* Disable button */

    generateButton.disabled = true;

    generateText.textContent = "Generating...";

    reportStatus.style.display = "block";

    reportStatus.style.background = "#eff6ff";

    reportStatus.style.borderColor = "#bfdbfe";

    reportStatus.style.color = "#2563eb";

    reportStatus.textContent =
      "Preparing " + reportType.toLowerCase() + " traffic report...";

    /*
     * Simulates backend report generation.
     * Replace this setTimeout with a fetch()
     * request to Flask later.
     */

    setTimeout(function () {
      addRecentReport(reportType, selectedOptions.length);

      generateButton.disabled = false;

      generateText.textContent = "Generate Report";

      showStatus(reportType + " report generated successfully.", "success");
    }, 1200);
  });

  /* =====================================================
       ADD RECENT REPORT
    ===================================================== */

  function addRecentReport(reportType, sectionCount) {
    const now = new Date();

    const date = now.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const title = reportType + " Report — " + date;

    let badgeClass = reportType.toLowerCase();

    if (reportType === "Custom") {
      badgeClass = "daily";
    }

    const reportElement = document.createElement("div");

    reportElement.className = "recent-report report-new";

    reportElement.innerHTML = `

            <div class="recent-report-info">

                <strong>
                    ${title}
                </strong>

                <span>
                    ${date}, ${time}
                    · ${sectionCount} sections
                </span>

            </div>


            <div class="recent-report-actions">

                <span class="report-badge ${badgeClass}">
                    ${reportType.toUpperCase()}
                </span>

                <button
                    class="pdf-btn"
                    data-report="${title}">
                    ↓ PDF
                </button>

            </div>

        `;

    /*
     * Put newest report at top
     */

    recentReportsList.prepend(reportElement);

    /*
     * Attach PDF functionality
     */

    const pdfButton = reportElement.querySelector(".pdf-btn");

    pdfButton.addEventListener("click", function () {
      downloadReportPDF(this.dataset.report);
    });
  }

  /* =====================================================
       STATUS MESSAGE
    ===================================================== */

  function showStatus(message, type) {
    reportStatus.style.display = "block";

    reportStatus.textContent = message;

    if (type === "success") {
      reportStatus.style.background = "#ecfdf5";

      reportStatus.style.borderColor = "#a7f3d0";

      reportStatus.style.color = "#059669";
    } else {
      reportStatus.style.background = "#fff1f2";

      reportStatus.style.borderColor = "#fecdd3";

      reportStatus.style.color = "#e11d48";
    }

    /*
     * Automatically hide success messages
     */

    if (type === "success") {
      setTimeout(function () {
        reportStatus.style.display = "none";
      }, 3000);
    }
  }

  /* =====================================================
       PDF DOWNLOAD
    ===================================================== */

  function downloadReportPDF(reportName) {
    /*
     * This is a simple browser-generated
     * text report for now.
     *
     * Later you can replace this with
     * Flask + ReportLab to generate
     * a real PDF.
     */

    const content = `

SMART TRAFFIC MONITORING APP
================================

${reportName}

Generated:
${new Date().toLocaleString()}


TRAFFIC SUMMARY
---------------

Total Vehicles: 41,294

Average Speed: 37 km/h

Congestion Index: LOW

Active Incidents: 3

YOLO Detection Accuracy: 97.4%


REPORT SECTIONS
---------------

Vehicle Count Summary
Incident Log
Signal Performance
YOLO Detection Stats
Congestion Heatmap
Speed Analytics
Classification Breakdown
Zone Comparison


This report was generated by
Smart Traffic Monitoring App.

        `;

    const blob = new Blob([content], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      reportName.replaceAll(" ", "_").replaceAll("—", "-") + ".pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /* =====================================================
       EXISTING PDF BUTTONS
    ===================================================== */

  document.querySelectorAll(".pdf-btn").forEach((button) => {
    button.addEventListener("click", function () {
      downloadReportPDF(this.dataset.report);
    });
  });
});
