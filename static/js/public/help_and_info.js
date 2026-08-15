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

document.addEventListener("DOMContentLoaded", function () {
  /* =====================================================
       AI ASSISTANT
    ====================================================== */

  const aiButton = document.getElementById("aiAssistantBtn");

  const aiChat = document.getElementById("aiChatWindow");

  const closeAiChat = document.getElementById("closeAiChat");

  const aiInput = document.getElementById("aiChatInput");

  const aiSend = document.getElementById("aiSendBtn");

  const aiMessages = document.getElementById("aiChatMessages");

  const typingIndicator = document.getElementById("aiTypingIndicator");

  const suggestions = document.querySelectorAll(".ai-suggestion");

  /* =====================================================
       OPEN / CLOSE CHAT
    ====================================================== */

  if (aiButton) {
    aiButton.addEventListener("click", function () {
      const isOpen = aiChat.classList.contains("open");

      if (isOpen) {
        closeChat();
      } else {
        openChat();
      }
    });
  }

  if (closeAiChat) {
    closeAiChat.addEventListener("click", closeChat);
  }

  function openChat() {
    aiChat.classList.add("open");

    aiChat.setAttribute("aria-hidden", "false");

    setTimeout(function () {
      aiInput.focus();
    }, 200);
  }

  function closeChat() {
    aiChat.classList.remove("open");

    aiChat.setAttribute("aria-hidden", "true");
  }

  /* =====================================================
       SEND BUTTON
    ====================================================== */

  if (aiSend) {
    aiSend.addEventListener("click", function () {
      sendMessage();
    });
  }

  /* =====================================================
       ENTER KEY
    ====================================================== */

  if (aiInput) {
    aiInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();

        sendMessage();
      }
    });
  }

  /* =====================================================
       SUGGESTED QUESTIONS
    ====================================================== */

  suggestions.forEach(function (button) {
    button.addEventListener("click", function () {
      const question = button.dataset.question;

      if (!question) {
        return;
      }

      openChat();

      addUserMessage(question);

      generateResponse(question);
    });
  });

  /* =====================================================
       SEND MESSAGE
    ====================================================== */

  function sendMessage() {
    const message = aiInput.value.trim();

    if (!message) {
      return;
    }

    /*
     * Clear input immediately.
     */

    aiInput.value = "";

    /*
     * Display user's message.
     */

    addUserMessage(message);

    /*
     * Generate assistant response.
     *
     * Currently this is a frontend demo.
     * Replace generateResponse() with a fetch()
     * request to your Flask AI endpoint later.
     */

    generateResponse(message);
  }

  /* =====================================================
       ADD USER MESSAGE
    ====================================================== */

  function addUserMessage(message) {
    const messageWrapper = document.createElement("div");

    messageWrapper.className = "ai-message user-message";

    messageWrapper.innerHTML = `

            <div class="message-bubble">
                ${escapeHTML(message)}
            </div>

        `;

    aiMessages.appendChild(messageWrapper);

    scrollToBottom();
  }

  /* =====================================================
       ADD ASSISTANT MESSAGE
    ====================================================== */

  function addAssistantMessage(message) {
    const messageWrapper = document.createElement("div");

    messageWrapper.className = "ai-message assistant-message";

    messageWrapper.innerHTML = `

            <div class="message-avatar">
                ✦
            </div>

            <div class="message-bubble">
                ${message}
            </div>

        `;

    aiMessages.appendChild(messageWrapper);

    scrollToBottom();
  }

  /* =====================================================
       AI RESPONSE
    ====================================================== */

  function generateResponse(question) {
    showTyping();

    /*
     * Simulate AI thinking.
     */

    setTimeout(function () {
      hideTyping();

      const response = getDemoResponse(question);

      addAssistantMessage(response);
    }, 900);
  }

  /* =====================================================
       DEMO KNOWLEDGE BASE
    ====================================================== */

  function getDemoResponse(question) {
    const text = question.toLowerCase();

    /*
     * Traffic colors
     */

    if (
      text.includes("traffic color") ||
      text.includes("traffic colours") ||
      text.includes("colors mean") ||
      text.includes("colours mean")
    ) {
      return `
                <strong>Traffic colors</strong><br><br>

                🟢 <strong>Green</strong> — Free-flowing traffic.<br>

                🟡 <strong>Yellow</strong> — Moderate traffic.<br>

                🟠 <strong>Orange</strong> — Heavy traffic.<br>

                🔴 <strong>Red</strong> — Severe congestion or
                standstill conditions.
            `;
    }

    /*
     * Journey planning
     */

    if (
      text.includes("plan") &&
      (text.includes("journey") || text.includes("route"))
    ) {
      return `
                To plan a journey, open
                <strong>Plan Journey</strong> from the sidebar.

                <br><br>

                Enter your starting location and destination.
                The system will show available routes along
                with their current traffic conditions.
            `;
    }

    /*
     * Complaint
     */

    if (text.includes("complaint") || text.includes("report")) {
      return `
                You can raise a complaint from
                <strong>Raise Complaint</strong> in the sidebar.

                <br><br>

                Select the complaint category, enter the
                location and issue details, and submit the form.

                <br><br>

                You can then track the complaint from your
                complaint history.
            `;
    }

    /*
     * Saved routes
     */

    if (text.includes("save") && text.includes("route")) {
      return `
                After planning a route, you can save it for
                easier access later.

                <br><br>

                Your saved routes are available under
                <strong>Saved Routes</strong>.
            `;
    }

    /*
     * Live map
     */

    if (text.includes("live map") || text.includes("traffic map")) {
      return `
                <strong>Live Traffic Map</strong> displays the
                current traffic situation across monitored
                roads and junctions.

                <br><br>

                Green, yellow, orange and red road segments
                indicate different levels of traffic congestion.
            `;
    }

    /*
     * Data updates
     */

    if (text.includes("update") || text.includes("data")) {
      return `
                Traffic information is continuously updated
                from the traffic monitoring system.

                <br><br>

                The exact update frequency can depend on the
                data source and monitoring component.
            `;
    }

    /*
     * Default response
     */

    return `
            I can help you with questions about the
            <strong>City Traffic Portal</strong>, including:

            <br><br>

            • Live traffic<br>
            • Route planning<br>
            • Traffic conditions<br>
            • Complaints<br>
            • Saved routes<br>
            • Traffic alerts<br>
            • Portal features

            <br><br>

            Try asking:
            <em>"How do I plan a journey?"</em>
        `;
  }

  /* =====================================================
       TYPING INDICATOR
    ====================================================== */

  function showTyping() {
    if (!typingIndicator) {
      return;
    }

    typingIndicator.hidden = false;

    scrollToBottom();
  }

  function hideTyping() {
    if (!typingIndicator) {
      return;
    }

    typingIndicator.hidden = true;
  }

  /* =====================================================
       SCROLL
    ====================================================== */

  function scrollToBottom() {
    setTimeout(function () {
      aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 50);
  }

  /* =====================================================
       ESCAPE HTML
    ====================================================== */

  function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
  }

  /* =====================================================
       ESC KEY CLOSE
    ====================================================== */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && aiChat.classList.contains("open")) {
      closeChat();
    }
  });
});
