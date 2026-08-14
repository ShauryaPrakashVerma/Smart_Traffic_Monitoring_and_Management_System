document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ====================================================== */

  const raiseNewComplaintBtn = document.getElementById("raiseNewComplaintBtn");

  const complaintFormCard = document.getElementById("complaintFormCard");

  const complaintForm = document.getElementById("complaintForm");

  const cancelComplaintBtn = document.getElementById("cancelComplaintBtn");

  const submitComplaintBtn = document.getElementById("submitComplaintBtn");

  const complaintList = document.getElementById("complaintList");

  const historyCount = document.getElementById("historyCount");

  const totalFiled = document.getElementById("totalFiled");

  const openCount = document.getElementById("openCount");

  const resolvedCount = document.getElementById("resolvedCount");

  const successBanner = document.getElementById("successBanner");

  const successReference = document.getElementById("successReference");

  const closeSuccessBtn = document.getElementById("closeSuccessBtn");

  /* =====================================================
       INITIAL DATA
    ====================================================== */

  let complaints = [
    {
      id: "CMP-77418",

      category: "Signal Fault",

      location: "Entered location",

      date: "15 Aug, 02:31",

      status: "Submitted",

      description:
        "Traffic signal reported as malfunctioning and causing delays at the junction.",

      filed: "15 Aug, 02:31",

      updated: "15 Aug, 02:31",

      remark:
        "Complaint received successfully. Our traffic team will review the issue.",
    },

    {
      id: "CMP-71842",

      category: "Signal Fault",

      location: "B2 Junction, Main St",

      date: "Aug 12, 09:14",

      status: "Resolved",

      description:
        "Traffic signal stuck on red for over 10 minutes causing severe backup.",

      filed: "Aug 12, 09:14",

      updated: "Aug 13, 11:00",

      remark: "Signal controller replaced. Issue resolved.",
    },

    {
      id: "CMP-71619",

      category: "Road Damage / Pothole",

      location: "A3 Eastbound, near overpass",

      date: "Aug 10, 14:32",

      status: "In Progress",

      description:
        "Large pothole reported on the eastbound lane causing vehicles to slow down.",

      filed: "Aug 10, 14:32",

      updated: "Aug 11, 09:30",

      remark:
        "Road maintenance team has been assigned to inspect and repair the location.",
    },

    {
      id: "CMP-71503",

      category: "Illegal Parking",

      location: "C2 Central, near bus stop",

      date: "Aug 09, 17:05",

      status: "Under Review",

      description:
        "Multiple vehicles reported blocking the designated bus stop area.",

      filed: "Aug 09, 17:05",

      updated: "Aug 10, 10:20",

      remark: "The report has been forwarded to the traffic enforcement team.",
    },

    {
      id: "CMP-71290",

      category: "Congestion",

      location: "B2-B3 corridor",

      date: "Aug 07, 08:20",

      status: "Resolved",

      description: "Heavy congestion reported during the morning peak period.",

      filed: "Aug 07, 08:20",

      updated: "Aug 08, 16:30",

      remark:
        "Signal timing was optimized and traffic flow has returned to normal.",
    },

    {
      id: "CMP-71041",

      category: "Other",

      location: "A1 Northbound",

      date: "Aug 04, 11:50",

      status: "Rejected",

      description:
        "General traffic issue reported without sufficient location information.",

      filed: "Aug 04, 11:50",

      updated: "Aug 05, 09:10",

      remark:
        "The complaint could not be processed because the submitted information was insufficient.",
    },
  ];

  /* =====================================================
       CURRENT FILTER
    ====================================================== */

  let currentFilter = "All";

  /* =====================================================
       ICONS
    ====================================================== */

  function getComplaintIcon(category, status) {
    if (status === "Resolved") {
      return "✓";
    }

    if (status === "Rejected") {
      return "✕";
    }

    if (category === "Signal Fault") {
      return "▣";
    }

    if (category === "Road Damage / Pothole") {
      return "⚒";
    }

    if (category === "Illegal Parking") {
      return "🔎";
    }

    if (category === "Congestion") {
      return "▤";
    }

    return "📄";
  }

  /* =====================================================
       STATUS CLASS
    ====================================================== */

  function getStatusClass(status) {
    switch (status) {
      case "Submitted":
        return "status-submitted";

      case "Under Review":
        return "status-review";

      case "In Progress":
        return "status-progress";

      case "Resolved":
        return "status-resolved";

      case "Rejected":
        return "status-rejected";

      default:
        return "status-submitted";
    }
  }

  /* =====================================================
       RENDER COMPLAINTS
    ====================================================== */

  function renderComplaints() {
    complaintList.innerHTML = "";

    const filteredComplaints =
      currentFilter === "All"
        ? complaints
        : complaints.filter(function (complaint) {
            return complaint.status === currentFilter;
          });

    /* EMPTY STATE */

    if (filteredComplaints.length === 0) {
      complaintList.innerHTML = `
                <div class="empty-history">
                    No complaints found for this category.
                </div>
            `;

      updateHistoryCount(filteredComplaints.length);

      return;
    }

    /* RENDER */

    filteredComplaints.forEach(function (complaint) {
      const item = document.createElement("div");

      item.className = "complaint-item";

      item.dataset.id = complaint.id;

      item.innerHTML = `

                <!-- COMPLAINT HEADER -->

                <div class="complaint-item-header">

                    <div class="complaint-icon">
                        ${getComplaintIcon(
                          complaint.category,
                          complaint.status,
                        )}
                    </div>


                    <div class="complaint-main">

                        <div class="complaint-title-line">

                            <span class="complaint-title">
                                ${escapeHTML(complaint.category)}
                            </span>

                            <span class="complaint-id">
                                ${escapeHTML(complaint.id)}
                            </span>

                        </div>


                        <div class="complaint-meta">

                            <span class="pin">📍</span>

                            ${escapeHTML(complaint.location)}

                            &nbsp; · &nbsp;

                            ${escapeHTML(complaint.date)}

                        </div>

                    </div>


                    <span
                        class="status-badge ${getStatusClass(complaint.status)}"
                    >
                        ${escapeHTML(complaint.status)}
                    </span>


                    <div class="complaint-arrow">
                        ▼
                    </div>

                </div>


                <!-- EXPANDED DETAILS -->

                <div class="complaint-details">

                    <div class="complaint-description">

                        ${escapeHTML(complaint.description)}

                    </div>


                    <!-- PROGRESS -->

                    ${renderProgress(complaint.status)}


                    <!-- OFFICIAL REMARK -->

                    <div class="official-remark">

                        <div class="official-remark-title">
                            OFFICIAL REMARK
                        </div>

                        <div class="official-remark-text">
                            ${escapeHTML(complaint.remark)}
                        </div>

                    </div>


                    <!-- FOOTER -->

                    <div class="complaint-footer">

                        <span>
                            Filed: ${escapeHTML(complaint.filed)}
                        </span>

                        <span>
                            Last updated:
                            ${escapeHTML(complaint.updated)}
                        </span>

                    </div>

                </div>
            `;

      /* =================================================
               CLICK COMPLAINT
            ================================================== */

      const header = item.querySelector(".complaint-item-header");

      header.addEventListener("click", function () {
        const wasExpanded = item.classList.contains("expanded");

        /* Close all */

        document
          .querySelectorAll(".complaint-item")
          .forEach(function (otherItem) {
            otherItem.classList.remove("expanded");

            const arrow = otherItem.querySelector(".complaint-arrow");

            if (arrow) {
              arrow.textContent = "▼";
            }
          });

        /* Open selected */

        if (!wasExpanded) {
          item.classList.add("expanded");

          const arrow = item.querySelector(".complaint-arrow");

          if (arrow) {
            arrow.textContent = "▲";
          }
        }
      });

      complaintList.appendChild(item);
    });

    updateHistoryCount(filteredComplaints.length);
  }

  /* =====================================================
       PROGRESS TRACKER
    ====================================================== */

  function renderProgress(status) {
    const stages = ["Submitted", "Under Review", "In Progress", "Resolved"];

    let currentIndex = stages.indexOf(status);

    if (status === "Rejected") {
      currentIndex = -1;
    }

    return `

            <div class="progress-track">

                ${stages
                  .map(function (stage, index) {
                    const completed = currentIndex >= index;

                    const active = currentIndex === index;

                    return `

                        <div
                            class="
                                progress-step
                                ${completed ? "completed" : ""}
                                ${active ? "active" : ""}
                            "
                        >

                            <div class="progress-dot">
                                ${completed ? "✓" : ""}
                            </div>

                            <div class="progress-label">
                                ${stage}
                            </div>

                        </div>

                    `;
                  })
                  .join("")}

            </div>

        `;
  }

  /* =====================================================
       HISTORY COUNT
    ====================================================== */

  function updateHistoryCount(count) {
    historyCount.textContent = `${count} complaint${count === 1 ? "" : "s"}`;
  }

  /* =====================================================
       STATISTICS
    ====================================================== */

  function updateStatistics() {
    const total = complaints.length;

    const resolved = complaints.filter(function (complaint) {
      return complaint.status === "Resolved";
    }).length;

    const open = complaints.filter(function (complaint) {
      return (
        complaint.status === "Submitted" ||
        complaint.status === "Under Review" ||
        complaint.status === "In Progress"
      );
    }).length;

    totalFiled.textContent = total;

    openCount.textContent = open;

    resolvedCount.textContent = resolved;
  }

  /* =====================================================
       RAISE NEW COMPLAINT
    ====================================================== */

  raiseNewComplaintBtn.addEventListener("click", function () {
    complaintFormCard.hidden = false;

    raiseNewComplaintBtn.hidden = true;

    successBanner.hidden = true;

    document.getElementById("category").focus();
  });

  /* =====================================================
       CANCEL
    ====================================================== */

  cancelComplaintBtn.addEventListener("click", function () {
    complaintForm.reset();

    complaintFormCard.hidden = true;

    raiseNewComplaintBtn.hidden = false;
  });

  /* =====================================================
       SUBMIT COMPLAINT
    ====================================================== */

  complaintForm.addEventListener("submit", function (event) {
    event.preventDefault();

    /* Browser validation */

    if (!complaintForm.checkValidity()) {
      complaintForm.reportValidity();

      return;
    }

    /* Prevent double submission */

    submitComplaintBtn.disabled = true;

    submitComplaintBtn.textContent = "Submitting...";

    /*
     * Small delay to make the prototype
     * feel like a real submission.
     */

    setTimeout(function () {
      const category = document.getElementById("category").value;

      const location = document.getElementById("location").value;

      const issueDate = document.getElementById("issueDate").value;

      const description = document.getElementById("description").value;

      /* Generate complaint ID */

      const complaintNumber = Math.floor(70000 + Math.random() * 29999);

      const complaintId = `CMP-${complaintNumber}`;

      /* Format date */

      const formattedDate = formatDate(issueDate);

      /* Create complaint */

      const newComplaint = {
        id: complaintId,

        category: category,

        location: location,

        date: formattedDate,

        status: "Submitted",

        description: description,

        filed: formattedDate,

        updated: formattedDate,

        remark:
          "Complaint received successfully. Our traffic team will review the issue.",
      };

      /* Add newest complaint at top */

      complaints.unshift(newComplaint);

      /* Update interface */

      updateStatistics();

      renderComplaints();

      /* Close form */

      complaintForm.reset();

      complaintFormCard.hidden = true;

      raiseNewComplaintBtn.hidden = false;

      /* Success banner */

      successReference.textContent = complaintId;

      successBanner.hidden = false;

      /* Reset button */

      submitComplaintBtn.disabled = false;

      submitComplaintBtn.textContent = "Submit Complaint";

      /* Scroll to success */

      successBanner.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 700);
  });

  /* =====================================================
       CLOSE SUCCESS BANNER
    ====================================================== */

  closeSuccessBtn.addEventListener("click", function () {
    successBanner.hidden = true;
  });

  /* =====================================================
       FILTER BUTTONS
    ====================================================== */

  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");

      currentFilter = button.dataset.filter;

      renderComplaints();
    });
  });

  /* =====================================================
       DATE FORMAT
    ====================================================== */

  function formatDate(value) {
    if (!value) {
      return "15 Aug, 02:31";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let hours = date.getHours();

    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `
            ${date.getDate()}
            ${months[date.getMonth()]},
            ${String(hours).padStart(2, "0")}:${minutes}
        `
      .replace(/\s+/g, " ")
      .trim();
  }

  /* =====================================================
       HTML ESCAPE
    ====================================================== */

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
  }

  /* =====================================================
       INITIAL RENDER
    ====================================================== */

  updateStatistics();

  renderComplaints();
});
