/* ==========================================================
   API HELPER
   Talks to the Google Apps Script Web App using JSONP, which
   avoids CORS issues entirely (same trick as the lantern site).

   >>> PASTE YOUR DEPLOYED APPS SCRIPT WEB APP URL BELOW <<<
   You get this URL after deploying Code.gs (see README.md).
   ========================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbxbyzIkNnNGBSYD3ZCoSLE_wM6r03HF4b4RIAM07oaiOyR658jPzA6Yaoi8I3BkaAfB/exec";

/**
 * Calls the Apps Script backend via a <script> tag (JSONP).
 * @param {Object} params - key/value pairs, must include `action`.
 * @returns {Promise<Object>} the JSON response from Apps Script.
 */
function apiCall(params) {
  return new Promise((resolve, reject) => {
    if (!API_URL || API_URL.indexOf("PASTE_YOUR") === 0) {
      reject(new Error("API_URL is not set yet. Open js/api.js and paste your Apps Script Web App URL."));
      return;
    }

    const callbackName = "qa_cb_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Request timed out. Check your internet connection and try again."));
    }, 12000);

    function cleanup() {
      clearTimeout(timeoutId);
      delete window[callbackName];
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    const query = new URLSearchParams({ ...params, callback: callbackName }).toString();
    const script = document.createElement("script");
    script.src = `${API_URL}?${query}`;
    script.onerror = () => {
      cleanup();
      reject(new Error("Could not reach the game server. Check the API_URL in js/api.js."));
    };
    document.body.appendChild(script);
  });
}

/* ---------- Small session helpers (kept in sessionStorage) ---------- */
const Session = {
  save(player) {
    sessionStorage.setItem("qa_player", JSON.stringify(player));
  },
  get() {
    const raw = sessionStorage.getItem("qa_player");
    return raw ? JSON.parse(raw) : null;
  },
  clear() {
    sessionStorage.removeItem("qa_player");
  },
};
