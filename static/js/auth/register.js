document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");

  const password = document.getElementById("password");

  const confirmPassword = document.getElementById("confirmPassword");

  const togglePassword = document.getElementById("togglePassword");

  const passwordStrength = document.getElementById("passwordStrength");

  const registerBtn = document.getElementById("registerBtn");

  const terms = document.getElementById("terms");

  const toast = document.getElementById("registerToast");

  let toastTimer;

  /* =====================================================
       PASSWORD VISIBILITY
    ====================================================== */

  togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";

      confirmPassword.type = "text";

      togglePassword.textContent = "Hide";
    } else {
      password.type = "password";

      confirmPassword.type = "password";

      togglePassword.textContent = "Show";
    }
  });

  /* =====================================================
       PASSWORD STRENGTH
    ====================================================== */

  password.addEventListener("input", function () {
    const value = password.value;

    passwordStrength.className = "password-strength";

    if (!value) {
      return;
    }

    let score = 0;

    if (value.length >= 8) {
      score++;
    }

    if (/[A-Z]/.test(value)) {
      score++;
    }

    if (/[0-9]/.test(value)) {
      score++;
    }

    if (/[^A-Za-z0-9]/.test(value)) {
      score++;
    }

    if (score <= 1) {
      passwordStrength.classList.add("weak");
    } else if (score <= 3) {
      passwordStrength.classList.add("medium");
    } else {
      passwordStrength.classList.add("strong");
    }
  });

  /* =====================================================
       REGISTRATION
    ====================================================== */

    form.addEventListener("submit", function (event) {
  // Prevent Flask submission temporarily so we can validate
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();

  const pass = password.value;
  const confirm = confirmPassword.value;

  let valid = true;

  /* =================================================
       CLEAR PREVIOUS ERRORS
  ================================================= */

  document.querySelectorAll(".input-error").forEach(function (input) {
    input.classList.remove("input-error");
  });

  document.querySelectorAll(".field-error").forEach(function (error) {
    error.textContent = "";
  });

  /* =================================================
       FULL NAME
  ================================================= */

  if (!fullName) {
    markError("fullName", "Please enter your full name.");
    valid = false;
  }

  /* =================================================
       EMAIL
  ================================================= */

  if (!email || !email.includes("@")) {
    markError("email", "Please enter a valid email address.");
    valid = false;
  }


  /* =================================================
       PASSWORD
  ================================================= */

  if (pass.length < 8) {
    showToast("Password must contain at least 8 characters.");
    password.classList.add("input-error");
    valid = false;
  }

  /* =================================================
       CONFIRM PASSWORD
  ================================================= */

  if (pass !== confirm) {
    document.getElementById("confirmPasswordError").textContent =
      "Passwords do not match.";

    confirmPassword.classList.add("input-error");

    valid = false;
  }

  /* =================================================
       TERMS
  ================================================= */

  if (!terms.checked) {
    showToast("Please accept the terms and conditions.");
    valid = false;
  }

  /* =================================================
       STOP IF VALIDATION FAILED
  ================================================= */

  if (!valid) {
    return;
  }

  /* =================================================
       SEND FORM TO FLASK
  ================================================= */

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating Account...";

  /*
   * IMPORTANT:
   *
   * We have finished frontend validation.
   * Now submit the actual HTML form to Flask.
   */

  form.submit();
});

  /* =====================================================
       ERROR HELPERS
    ====================================================== */

  function markError(inputId, message) {
    const input = document.getElementById(inputId);

    input.classList.add("input-error");

    const error = document.getElementById(inputId + "Error");

    if (error) {
      error.textContent = message;
    }
  }

  /* =====================================================
       CLEAR ERRORS
    ====================================================== */

  document.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", function () {
      input.classList.remove("input-error");

      const error = document.getElementById(input.id + "Error");

      if (error) {
        error.textContent = "";
      }
    });
  });

  /* =====================================================
       TOAST
    ====================================================== */

  function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;

    toast.classList.add("show");

    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2800);
  }
});
