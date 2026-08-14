document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ====================================================== */

  const page = document.querySelector(".emergency-page");

  const activateButton = document.getElementById("activateCorridorBtn");

  const deactivateButton = document.getElementById("deactivateCorridorBtn");

  const bannerDeactivateButton = document.getElementById("bannerDeactivateBtn");

  const extendButton = document.getElementById("extendCorridorBtn");

  const activeBanner = document.getElementById("activeCorridorBanner");

  const statusBadge = document.getElementById("corridorStatusBadge");

  const timerContainer = document.getElementById("corridorTimer");

  const timerValue = document.getElementById("timerValue");

  const activeRouteText = document.getElementById("activeRouteText");

  const activeUnitText = document.getElementById("activeUnitText");

  const unitButtons = document.querySelectorAll(".unit-button");

  const routeInputs = document.querySelectorAll('input[name="corridorRoute"]');

  const intersectionRows = document.querySelectorAll(".intersection-row");

  /* =====================================================
       STATE
    ====================================================== */

  let corridorActive = false;

  let selectedUnit = "EV-07";

  let selectedRoute = "A3-B3-C3";

  let remainingSeconds = 300;

  let timerInterval = null;

  /* =====================================================
       UNIT SELECTION
    ====================================================== */

  unitButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (corridorActive) {
        return;
      }

      unitButtons.forEach((item) => {
        item.classList.remove("selected");
      });

      this.classList.add("selected");

      selectedUnit = this.dataset.unit;
    });
  });

  /* =====================================================
       ROUTE SELECTION
    ====================================================== */

  routeInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (corridorActive) {
        return;
      }

      selectedRoute = this.value;
    });
  });

  /* =====================================================
       GET SELECTED ROUTE
    ====================================================== */

  function getSelectedRoute() {
    const selected = document.querySelector(
      'input[name="corridorRoute"]:checked',
    );

    return selected ? selected.value : "A3-B3-C3";
  }

  /* =====================================================
       ACTIVATE CORRIDOR
    ====================================================== */

  activateButton.addEventListener("click", function () {
    selectedRoute = getSelectedRoute();

    selectedUnit =
      document.querySelector(".unit-button.selected")?.dataset.unit || "EV-07";

    corridorActive = true;

    /* Update page state */

    page.classList.add("corridor-active");

    /* Show active elements */

    activeBanner.classList.remove("hidden");

    statusBadge.classList.remove("hidden");

    deactivateButton.classList.remove("hidden");

    extendButton.classList.remove("hidden");

    timerContainer.classList.remove("hidden");

    /* Update banner */

    activeRouteText.textContent = selectedRoute;

    activeUnitText.textContent = selectedUnit;

    /* Update intersections */

    updateIntersections();

    /* Start timer */

    remainingSeconds = 300;

    startTimer();

    /*
     * In a real application this is where
     * you would send a request to Flask:
     *
     * fetch("/api/emergency-corridor/activate", {
     *     method: "POST",
     *     headers: {
     *         "Content-Type":
     *             "application/json"
     *     },
     *     body: JSON.stringify({
     *         unit: selectedUnit,
     *         route: selectedRoute
     *     })
     * });
     */
  });

  /* =====================================================
       DEACTIVATE
    ====================================================== */

  function deactivateCorridor() {
    corridorActive = false;

    page.classList.remove("corridor-active");

    activeBanner.classList.add("hidden");

    statusBadge.classList.add("hidden");

    deactivateButton.classList.add("hidden");

    extendButton.classList.add("hidden");

    timerContainer.classList.add("hidden");

    stopTimer();

    resetIntersections();
  }

  deactivateButton.addEventListener("click", deactivateCorridor);

  bannerDeactivateButton.addEventListener("click", deactivateCorridor);

  /* =====================================================
       UPDATE INTERSECTIONS
    ====================================================== */

  function updateIntersections() {
    const routeIntersections = selectedRoute.split("-");

    intersectionRows.forEach((row) => {
      const intersection = row.dataset.intersection;

      const number = row.querySelector(".intersection-number");

      const signalText = row.querySelector(".signal-text");

      const signalBadge = row.querySelector(".signal-badge");

      if (routeIntersections.includes(intersection)) {
        row.classList.add("active");

        number.textContent = routeIntersections.indexOf(intersection) + 1;

        signalText.textContent = "Signal: FORCED GREEN";

        signalBadge.classList.remove("hidden");
      }
    });
  }

  /* =====================================================
       RESET INTERSECTIONS
    ====================================================== */

  function resetIntersections() {
    intersectionRows.forEach((row, index) => {
      row.classList.remove("active");

      const number = row.querySelector(".intersection-number");

      const signalText = row.querySelector(".signal-text");

      const signalBadge = row.querySelector(".signal-badge");

      number.textContent = index + 1;

      signalText.textContent =
        index === 0 ? "Signal: emergency" : "Signal: normal";

      signalBadge.classList.add("hidden");
    });
  }

  /* =====================================================
       TIMER
    ====================================================== */

  function startTimer() {
    stopTimer();

    updateTimer();

    timerInterval = setInterval(function () {
      remainingSeconds--;

      updateTimer();

      if (remainingSeconds <= 0) {
        deactivateCorridor();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);

      timerInterval = null;
    }
  }

  function updateTimer() {
    const minutes = Math.floor(remainingSeconds / 60);

    const seconds = remainingSeconds % 60;

    timerValue.textContent =
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  /* =====================================================
       EXTEND 5 MINUTES
    ====================================================== */

  extendButton.addEventListener("click", function () {
    if (!corridorActive) {
      return;
    }

    remainingSeconds += 300;

    updateTimer();

    /*
     * Real backend call can later go here:
     *
     * fetch("/api/emergency-corridor/extend", {
     *     method: "POST"
     * });
     */
  });
});
