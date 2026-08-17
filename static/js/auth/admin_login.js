document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       ELEMENTS
  ====================================================== */

  const loginForm = document.getElementById("adminLoginForm");

  const adminId = document.getElementById("adminId");

  const password = document.getElementById("password");

  const togglePassword = document.getElementById("togglePassword");

  const signInBtn = document.getElementById("adminSignInBtn");

  const forgotPassword = document.getElementById("forgotPassword");

  const adminIdError = document.getElementById("adminIdError");

  const passwordError = document.getElementById("passwordError");

  const toast = document.getElementById("adminToast");

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
       CLEAR ADMIN ID ERROR
  ====================================================== */

  adminId.addEventListener("input", function () {
    adminId.classList.remove("input-error");

    adminIdError.textContent = "";
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
    const id = adminId.value.trim();

    const pass = password.value.trim();

    let valid = true;

    /* -------------------------------------------------
       ADMIN ID
    ------------------------------------------------- */

    if (!id) {
      adminId.classList.add("input-error");

      adminIdError.textContent = "Please enter your administrator email.";

      valid = false;
    }

    /* -------------------------------------------------
       PASSWORD
    ------------------------------------------------- */

    if (!pass) {
      password.classList.add("input-error");

      passwordError.textContent = "Please enter your password.";

      valid = false;
    }

    /* -------------------------------------------------
       STOP INVALID FORM
    ------------------------------------------------- */

    if (!valid) {
      event.preventDefault();

      return;
    }

    /* -------------------------------------------------
       SEND TO FLASK
    ------------------------------------------------- */

    signInBtn.disabled = true;

    signInBtn.textContent = "Authenticating...";

    /*
     * DO NOT call event.preventDefault()
     * here.
     *
     * The browser will submit the form normally
     * to:
     *
     * auth.admin_login
     *
     * Flask will then:
     *
     * 1. Find the administrator
     * 2. Verify the password
     * 3. Verify role == admin
     * 4. Create the admin session
     * 5. Redirect to the admin dashboard
     */
  });

  /* =====================================================
       FORGOT PASSWORD
  ====================================================== */

  forgotPassword.addEventListener("click", function (event) {
    event.preventDefault();

    showToast("Administrator password recovery will be available soon.");
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
    }, 2800);
  }
});
