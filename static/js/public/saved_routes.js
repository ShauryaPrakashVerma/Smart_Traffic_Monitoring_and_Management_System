document.addEventListener("DOMContentLoaded", function () {
  console.log("Saved Routes JS loaded");

  /* =====================================================
       ELEMENTS
    ====================================================== */

  const routesContainer = document.getElementById("routesContainer");

  const addRouteBtn = document.getElementById("addRouteBtn");

  const addRouteForm = document.getElementById("addRouteForm");

  const cancelRouteBtn = document.getElementById("cancelRouteBtn");

  const saveRouteBtn = document.getElementById("saveRouteBtn");

  const routeName = document.getElementById("routeName");

  const routePath = document.getElementById("routePath");

  const routeDistance = document.getElementById("routeDistance");

  const routeTraffic = document.getElementById("routeTraffic");

  const toast = document.getElementById("routeToast");

  /* =====================================================
       TOAST
    ====================================================== */

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
    }, 2500);
  }

  /* =====================================================
       ADD NEW ROUTE
    ====================================================== */

  if (addRouteBtn) {
    addRouteBtn.addEventListener("click", function () {
      const isHidden = addRouteForm.hasAttribute("hidden");

      if (isHidden) {
        addRouteForm.removeAttribute("hidden");

        addRouteBtn.textContent = "− Cancel Add Route";

        /*
         * Automatically focus the first field.
         */

        setTimeout(function () {
          if (routeName) {
            routeName.focus();
          }
        }, 100);
      } else {
        closeAddForm();
      }
    });
  }

  /* =====================================================
       CLOSE ADD FORM
    ====================================================== */

  function closeAddForm() {
    addRouteForm.setAttribute("hidden", "");

    addRouteBtn.textContent = "+ Add New Route";

    clearForm();
  }

  /* =====================================================
       CLEAR FORM
    ====================================================== */

  function clearForm() {
    if (routeName) {
      routeName.value = "";
    }

    if (routePath) {
      routePath.value = "";
    }

    if (routeDistance) {
      routeDistance.value = "";
    }

    if (routeTraffic) {
      routeTraffic.value = "free";
    }
  }

  /* =====================================================
       CANCEL BUTTON
    ====================================================== */

  if (cancelRouteBtn) {
    cancelRouteBtn.addEventListener("click", function () {
      closeAddForm();
    });
  }

  /* =====================================================
       SAVE NEW ROUTE
    ====================================================== */

  if (saveRouteBtn) {
    saveRouteBtn.addEventListener("click", function () {
      /*
       * Read values.
       */

      const name = routeName.value.trim();

      const path = routePath.value.trim();

      const distance = routeDistance.value.trim();

      const traffic = routeTraffic.value;

      /* -----------------------------------------
                   VALIDATION
                ----------------------------------------- */

      if (!name) {
        showToast("Please enter a route name.");

        routeName.focus();

        return;
      }

      if (!path) {
        showToast("Please enter the route path.");

        routePath.focus();

        return;
      }

      if (!distance) {
        showToast("Please enter the route distance.");

        routeDistance.focus();

        return;
      }

      /*
       * Create the route card.
       */

      const routeCard = createRouteCard(name, path, distance, traffic);

      /*
       * Add it to the list.
       */

      routesContainer.appendChild(routeCard);

      /*
       * Close form.
       */

      closeAddForm();

      /*
       * Show confirmation.
       */

      showToast(`"${name}" added to saved routes.`);
    });
  }

  /* =====================================================
       CREATE ROUTE CARD
    ====================================================== */

  function createRouteCard(name, path, distance, traffic) {
    const card = document.createElement("div");

    card.className = `route-card ${traffic}`;

    card.dataset.routeId = "route-" + Date.now();

    /* -----------------------------------------
           Traffic text
        ----------------------------------------- */

    let trafficText = traffic.toUpperCase();

    let trafficClass = `${traffic}-text`;

    /* -----------------------------------------
           Card HTML
        ----------------------------------------- */

    card.innerHTML = `

            <div class="route-main">

                <div class="route-title">
                    ${escapeHtml(name)}
                </div>

                <div class="route-path">
                    ${escapeHtml(path)} · ${escapeHtml(distance)}
                </div>

            </div>


            <div class="route-meta">

                <div class="traffic-status ${trafficClass}">
                    ${trafficText}
                </div>

                <div class="saved-time">
                    Saved just now
                </div>

            </div>


            <div class="route-actions">

                <button
                    type="button"
                    class="route-btn navigate-btn"
                    data-route="${escapeHtml(name)}"
                >
                    Navigate
                </button>

                <button
                    type="button"
                    class="route-btn remove-btn"
                >
                    Remove
                </button>

            </div>

        `;

    /*
     * Attach button functionality.
     */

    attachRouteButtons(card);

    return card;
  }

  /* =====================================================
       ATTACH ROUTE BUTTONS
    ====================================================== */

  function attachRouteButtons(card) {
    const navigateBtn = card.querySelector(".navigate-btn");

    const removeBtn = card.querySelector(".remove-btn");

    /* -----------------------------------------
           Navigate
        ----------------------------------------- */

    if (navigateBtn) {
      navigateBtn.addEventListener("click", function () {
        const route = navigateBtn.dataset.route;

        showToast(`Navigating via ${route}...`);
      });
    }

    /* -----------------------------------------
           Remove
        ----------------------------------------- */

    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        const routeTitle = card.querySelector(".route-title");

        const routeName = routeTitle ? routeTitle.textContent.trim() : "Route";

        /*
         * Confirmation.
         */

        const confirmed = window.confirm(
          `Remove "${routeName}" from saved routes?`,
        );

        if (!confirmed) {
          return;
        }

        /*
         * Animate removal.
         */

        card.classList.add("removing");

        setTimeout(function () {
          card.remove();

          checkEmptyState();

          showToast(`"${routeName}" removed.`);
        }, 200);
      });
    }
  }

  /* =====================================================
       INITIAL BUTTONS
    ====================================================== */

  const initialCards = document.querySelectorAll(".route-card");

  initialCards.forEach(function (card) {
    attachRouteButtons(card);
  });

  /* =====================================================
       EMPTY STATE
    ====================================================== */

  function checkEmptyState() {
    const cards = routesContainer.querySelectorAll(".route-card");

    const existingEmpty = routesContainer.querySelector(".empty-routes");

    if (cards.length === 0) {
      if (!existingEmpty) {
        const empty = document.createElement("div");

        empty.className = "empty-routes";

        empty.textContent = "No saved routes yet.";

        routesContainer.appendChild(empty);
      }
    } else {
      if (existingEmpty) {
        existingEmpty.remove();
      }
    }
  }

  /* =====================================================
       HTML ESCAPE
    ====================================================== */

  function escapeHtml(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }

  console.log("Saved Routes initialized successfully");
});
