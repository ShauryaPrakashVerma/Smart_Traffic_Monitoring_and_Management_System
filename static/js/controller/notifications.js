document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".notification-card"));

  const filterButtons = document.querySelectorAll(".filter-btn");

  const activeCountElement = document.getElementById("activeCount");

  const totalCountElement = document.getElementById("totalCount");

  const markAllReadBtn = document.getElementById("markAllReadBtn");

  const exportBtn = document.getElementById("exportBtn");

  const grid = document.getElementById("notificationsGrid");

  let currentFilter = "all";

  /* =====================================================
       UPDATE COUNTS
    ===================================================== */

  function updateCounts() {
    const activeCards = cards.filter((card) => {
      return card.dataset.status === "active";
    });

    activeCountElement.textContent = activeCards.length;

    totalCountElement.textContent = cards.length;
  }

  /* =====================================================
       FILTER ALERTS
    ===================================================== */

  function applyFilter(filter) {
    currentFilter = filter;

    let visibleCards = 0;

    cards.forEach((card) => {
      const severity = card.dataset.severity;

      const status = card.dataset.status;

      let shouldShow = false;

      if (filter === "all") {
        shouldShow = true;
      } else if (filter === "active") {
        shouldShow = status === "active";
      } else {
        shouldShow = severity === filter;
      }

      if (shouldShow) {
        card.classList.remove("hidden");

        visibleCards++;
      } else {
        card.classList.add("hidden");
      }
    });

    showEmptyState(visibleCards === 0);
  }

  /* =====================================================
       EMPTY STATE
    ===================================================== */

  function showEmptyState(show) {
    const existing = document.querySelector(".notifications-empty");

    if (show && !existing) {
      const empty = document.createElement("div");

      empty.className = "notifications-empty";

      empty.innerHTML = `
                <strong>No notifications found</strong>
                <span>
                    There are no alerts matching this filter.
                </span>
            `;

      grid.appendChild(empty);
    }

    if (!show && existing) {
      existing.remove();
    }
  }

  /* =====================================================
       FILTER BUTTONS
    ===================================================== */

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      const filter = button.dataset.filter;

      applyFilter(filter);
    });
  });

  /* =====================================================
       ACKNOWLEDGE SINGLE ALERT
    ===================================================== */

  function acknowledgeCard(card) {
    card.dataset.status = "acknowledged";

    card.classList.remove("active");

    card.classList.add("acknowledged");

    card.classList.add("is-acknowledged");

    const badge = card.querySelector(".status-badge");

    if (badge) {
      badge.textContent = "ACKNOWLEDGED";

      badge.classList.remove("active-badge");

      badge.classList.add("acknowledged-badge");
    }

    const button = card.querySelector(".ack-btn");

    if (button) {
      button.remove();
    }

    updateCounts();

    applyFilter(currentFilter);
  }

  /* =====================================================
       ACKNOWLEDGE BUTTONS
    ===================================================== */

  cards.forEach((card) => {
    const ackButton = card.querySelector(".ack-btn");

    if (!ackButton) {
      return;
    }

    ackButton.addEventListener("click", (event) => {
      event.stopPropagation();

      acknowledgeCard(card);
    });
  });

  /* =====================================================
       MARK ALL READ
    ===================================================== */

  markAllReadBtn.addEventListener("click", () => {
    cards.forEach((card) => {
      if (card.dataset.status === "active") {
        acknowledgeCard(card);
      }
    });

    markAllReadBtn.textContent = "All Read";

    setTimeout(() => {
      markAllReadBtn.textContent = "Mark All Read";
    }, 1500);
  });

  /* =====================================================
       EXPORT CSV
    ===================================================== */

  exportBtn.addEventListener("click", () => {
    const rows = [["Alert", "Location", "Time", "Severity", "Status"]];

    cards.forEach((card) => {
      const title = card.querySelector("h3")?.textContent.trim() || "";

      const metadata = card.querySelector(".notification-meta");

      const spans = metadata ? metadata.querySelectorAll("span") : [];

      const location = spans[0]?.textContent.replace("📍", "").trim() || "";

      const time = spans[2]?.textContent.trim() || "";

      const severity = card.dataset.severity || "";

      const status = card.dataset.status || "";

      rows.push([title, location, time, severity, status]);
    });

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "traffic_alert_log.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  });

  /* =====================================================
       INITIALIZE
    ===================================================== */

  updateCounts();

  applyFilter("all");
});
