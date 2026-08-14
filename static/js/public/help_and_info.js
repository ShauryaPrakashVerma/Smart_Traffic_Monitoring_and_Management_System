document.addEventListener("DOMContentLoaded", function () {
  console.log("Help & Info JS loaded");

  /* =====================================================
       GET ALL FAQ ITEMS
    ====================================================== */

  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) {
    console.error("Help & Info: No FAQ items found.");

    return;
  }

  console.log(`Help & Info: ${faqItems.length} FAQ items found`);

  /* =====================================================
       CLOSE FAQ
    ====================================================== */

  function closeFaq(item) {
    item.classList.remove("active");

    const button = item.querySelector(".faq-question");

    const icon = item.querySelector(".faq-icon");

    if (button) {
      button.setAttribute("aria-expanded", "false");
    }

    if (icon) {
      icon.textContent = "+";
    }
  }

  /* =====================================================
       OPEN FAQ
    ====================================================== */

  function openFaq(item) {
    item.classList.add("active");

    const button = item.querySelector(".faq-question");

    const icon = item.querySelector(".faq-icon");

    if (button) {
      button.setAttribute("aria-expanded", "true");
    }

    if (icon) {
      icon.textContent = "−";
    }
  }

  /* =====================================================
       FAQ CLICK HANDLERS
    ====================================================== */

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-question");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("active");

      /*
       * Close every FAQ first.
       */

      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          closeFaq(otherItem);
        }
      });

      /*
       * If clicked item was already open,
       * close it.
       */

      if (isOpen) {
        closeFaq(item);

        console.log("FAQ collapsed");

        return;
      }

      /*
       * Otherwise open it.
       */

      openFaq(item);

      console.log("FAQ expanded:", button.querySelector("span")?.textContent);
    });
  });

  /* =====================================================
       KEYBOARD ACCESSIBILITY
    ====================================================== */

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-question");

    if (!button) {
      return;
    }

    button.addEventListener("keydown", function (event) {
      /*
       * Enter and Space already trigger
       * native button behavior in most browsers,
       * so no custom handling is required.
       */
    });
  });
});
