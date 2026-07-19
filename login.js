/* ==========================================================
   LOGIN SCREEN LOGIC
   Validates name + class + PIN against the "Students" tab in
   Google Sheets, then sends the player to game.html.
   ========================================================== */

let selectedLevel = "Easy";

document.querySelectorAll(".level-door").forEach((door) => {
  door.addEventListener("click", () => {
    document.querySelectorAll(".level-door").forEach((d) => d.classList.remove("active"));
    door.classList.add("active");
    selectedLevel = door.dataset.level;
  });
});

const form = document.getElementById("loginForm");
const errorBox = document.getElementById("loginError");
const loginBtn = document.getElementById("loginBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.classList.remove("show");

  const name = document.getElementById("name").value.trim();
  const className = document.getElementById("className").value.trim();
  const pin = document.getElementById("pin").value.trim();

  if (!name || !className || !pin) return;

  loginBtn.textContent = "Checking...";
  loginBtn.disabled = true;

  try {
    const res = await apiCall({ action: "login", name, className, pin });

    if (res.success) {
      Session.save({ name: res.name, className: res.className, level: selectedLevel });
      window.location.href = "game.html";
    } else {
      errorBox.textContent = res.message || "Name or PIN not recognized. Check with your teacher.";
      errorBox.classList.add("show");
    }
  } catch (err) {
    errorBox.textContent = err.message;
    errorBox.classList.add("show");
  } finally {
    loginBtn.textContent = "Start the Quest";
    loginBtn.disabled = false;
  }
});
