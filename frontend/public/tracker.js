
(function () {
  const API_URL = "http://localhost:5000/api/events";
  const STORAGE_KEY = "cf_session_id";

  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  function trackEvent(eventType, click = undefined) {
    const payload = {
      session_id: sessionId,
      event_type: eventType,
      page_url: window.location.href,
      ...(click ? { click } : {}),
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Tracking failed: ${response.status}`);
        }

        console.log("Event tracked:", eventType);
      })
      .catch((error) => {
        console.error("Analytics tracking error:", error);
      });
  }

  // Track the initial page view.
  trackEvent("page_view");

  // Track clicks anywhere on the page.
  document.addEventListener("click", (event) => {
    trackEvent("click", {
      x: event.clientX,
      y: event.clientY,
    });
  });
})();
