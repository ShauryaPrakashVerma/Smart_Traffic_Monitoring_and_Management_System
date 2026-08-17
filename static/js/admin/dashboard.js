document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
    ====================================================== */

  const publicSearch = document.getElementById("publicUserSearch");

  const controllerSearch = document.getElementById("controllerSearch");

  const toast = document.getElementById("adminToast");

  /* =====================================================
       TOAST
    ====================================================== */

  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  /* =====================================================
       PUBLIC USER SEARCH
    ====================================================== */

  if (publicSearch) {
    publicSearch.addEventListener("input", function () {
      const query = publicSearch.value.toLowerCase().trim();

      const rows = document.querySelectorAll("#publicUserList .user-row");

      rows.forEach(function (row) {
        const name = row.dataset.name || "";

        const email = row.dataset.email || "";

        const matches = name.includes(query) || email.includes(query);

        row.style.display = matches ? "flex" : "none";
      });
    });
  }

  /* =====================================================
       CONTROLLER SEARCH
    ====================================================== */

  if (controllerSearch) {
    controllerSearch.addEventListener("input", function () {
      const query = controllerSearch.value.toLowerCase().trim();

      const rows = document.querySelectorAll("#controllerList .user-row");

      rows.forEach(function (row) {
        const name = row.dataset.name || "";

        const email = row.dataset.email || "";

        const employee = row.dataset.employee || "";

        const matches =
          name.includes(query) ||
          email.includes(query) ||
          employee.includes(query);

        row.style.display = matches ? "flex" : "none";
      });
    });
  }

  /* =====================================================
       PUBLIC USER APPROVAL
    ====================================================== */

  document.querySelectorAll(".user-toggle").forEach(function (toggle) {
    toggle.addEventListener("change", async function () {
      const userId = this.dataset.userId;

      const approved = this.checked;

      try {
        const response = await fetch(`/admin/users/${userId}/status`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: approved ? "approved" : "not_approved",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.checked = !approved;

          showToast(data.error || "Unable to update user.");

          return;
        }

        updateStatusLabel(`userStatus${userId}`, approved);

        showToast(approved ? "User approved." : "User access disabled.");
      } catch (error) {
        this.checked = !approved;

        showToast("Server error. Please try again.");
      }
    });
  });

  /* =====================================================
       CONTROLLER APPROVAL
    ====================================================== */

  document.querySelectorAll(".controller-toggle").forEach(function (toggle) {
    toggle.addEventListener("change", async function () {
      const userId = this.dataset.userId;

      const approved = this.checked;

      try {
        const response = await fetch(`/admin/controllers/${userId}/status`, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: approved ? "approved" : "not_approved",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          this.checked = !approved;

          showToast(data.error || "Unable to update controller.");

          return;
        }

        updateStatusLabel(`controllerStatus${userId}`, approved);

        showToast(
          approved ? "Controller approved." : "Controller access disabled.",
        );
      } catch (error) {
        this.checked = !approved;

        showToast("Server error. Please try again.");
      }
    });
  });

  /* =====================================================
       STATUS LABEL
    ====================================================== */

  function updateStatusLabel(elementId, approved) {
    const element = document.getElementById(elementId);

    if (!element) {
      return;
    }

    if (approved) {
      element.textContent = "Approved";

      element.classList.remove("not-approved");

      element.classList.add("approved");
    } else {
      element.textContent = "Not Approved";

      element.classList.remove("approved");

      element.classList.add("not-approved");
    }
  }

  /* =====================================================
       CAMERA PERMISSIONS
    ====================================================== */

  document.querySelectorAll(".save-permission-btn").forEach(function (button) {
    button.addEventListener("click", async function () {
      const userId = this.dataset.userId;

      const input = document.querySelector(
        `.camera-count[data-user-id="${userId}"]`,
      );

      const cameraLimit = parseInt(input.value);

      if (Number.isNaN(cameraLimit) || cameraLimit < 0 || cameraLimit > 50) {
        showToast("Camera count must be between 0 and 50.");

        return;
      }

      try {
        const response = await fetch(
          `/admin/controllers/${userId}/permissions`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              camera_limit: cameraLimit,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          showToast(data.error || "Unable to save permissions.");

          return;
        }

        showToast("Camera permissions updated.");
      } catch (error) {
        showToast("Server error. Please try again.");
      }
    });
  });
});
