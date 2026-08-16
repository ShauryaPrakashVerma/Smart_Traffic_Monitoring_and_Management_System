document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
  ====================================================== */

  const loginForm = document.getElementById("loginForm");

  const employeeId = document.getElementById("employeeId");

  const password = document.getElementById("password");

  const togglePassword = document.getElementById("togglePassword");

  const signInBtn = document.getElementById("signInBtn");

  const forgotPassword = document.getElementById("forgotPassword");

  const employeeIdError = document.getElementById("employeeIdError");

  const passwordError = document.getElementById("passwordError");

  const toast = document.getElementById("loginToast");

  let toastTimer;

  /* =====================================================
       PASSWORD VISIBILITY
  ====================================================== */

  togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";

      togglePassword.textContent = "Hide";

      togglePassword.setAttribute("aria-label", "Hide password");
    } else {
      password.type = "password";

      togglePassword.textContent = "Show";

      togglePassword.setAttribute("aria-label", "Show password");
    }
  });

  /* =====================================================
       CLEAR ID ERROR
  ====================================================== */

  employeeId.addEventListener("input", function () {
    employeeId.classList.remove("input-error");

    employeeIdError.textContent = "";
  });

  /* =====================================================
       CLEAR PASSWORD ERROR
  ====================================================== */

  password.addEventListener("input", function () {
    password.classList.remove("input-error");

    passwordError.textContent = "";
  });

  /* =====================================================
       LOGIN VALIDATION
  ====================================================== */

  loginForm.addEventListener("submit", function (event) {
    const id = employeeId.value.trim();

    const pass = password.value.trim();

    let valid = true;

    /* -------------------------------------------------
       ID VALIDATION
    ------------------------------------------------- */

    if (!id) {
      employeeId.classList.add("input-error");

      employeeIdError.textContent = "Please enter your user or employee ID.";

      valid = false;
    }

    /* -------------------------------------------------
       PASSWORD VALIDATION
    ------------------------------------------------- */

    if (!pass) {
      password.classList.add("input-error");

      passwordError.textContent = "Please enter your password.";

      valid = false;
    }

    /* -------------------------------------------------
       STOP SUBMISSION IF INVALID
    ------------------------------------------------- */

    if (!valid) {
      event.preventDefault();

      return;
    }

    /* -------------------------------------------------
       ALLOW FLASK TO HANDLE LOGIN
    ------------------------------------------------- */

    signInBtn.disabled = true;

    signInBtn.textContent = "Signing In...";

    /*
     * IMPORTANT:
     *
     * We do NOT call preventDefault().
     *
     * Therefore the form is submitted normally to:
     *
     * /login
     *
     * Flask will authenticate the user and determine
     * their role from the database.
     */
  });

  /* =====================================================
       FORGOT PASSWORD
  ====================================================== */

  forgotPassword.addEventListener("click", function (event) {
    event.preventDefault();

    showToast("Password recovery will be available soon.");
  });

  /* =====================================================
       TOAST
  ====================================================== */

  function showToast(message) {
    if (!toast) {
      return;
    }

    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }
});
