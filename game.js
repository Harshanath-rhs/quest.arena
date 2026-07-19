/* ==========================================================
   GAMEPLAY LOGIC
   Merges local questions (js/questions.js) with any extra
   questions from the Google Sheet, runs the quiz, then submits
   the final score to the "Scores" tab and shows a results card.
   ========================================================== */

const QUESTIONS_PER_GAME = 10;
const SECONDS_PER_QUESTION = 15;

const player = Session.get();
if (!player) {
  window.location.href = "index.html";
}

const gameArea = document.getElementById("gameArea");
const questPathEl = document.getElementById("questPath");
const hudScore = document.getElementById("hudScore");
const hudStreak = document.getElementById("hudStreak");
const hudTimer = document.getElementById("hudTimer");
const speechBubble = document.getElementById("speechBubble");
const mascotBody = document.querySelectorAll("#mascotSvg circle, #mascotSvg ellipse");

document.getElementById("hudName").textContent = player.name;

let quizQuestions = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let timerInterval = null;
let timeLeft = SECONDS_PER_QUESTION;
let answered = false;

/* ---------- Setup ---------- */

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function loadQuestions() {
  const local = LOCAL_QUESTIONS.filter((q) => q.level === player.level);
  let remote = [];

  try {
    const res = await apiCall({ action: "getQuestions", level: player.level });
    if (res && res.success && Array.isArray(res.questions)) {
      remote = res.questions;
    }
  } catch (err) {
    // Sheet questions are optional — silently fall back to local-only.
    console.warn("Could not load Sheet questions, using local bank only:", err.message);
  }

  const merged = shuffle([...local, ...remote]);
  quizQuestions = merged.slice(0, Math.min(QUESTIONS_PER_GAME, merged.length));

  if (quizQuestions.length === 0) {
    gameArea.innerHTML = `<div class="card state-msg">No questions found for this level yet.<br>Ask your teacher to add some!</div>`;
    return;
  }

  buildQuestPath();
  showQuestion();
}

function buildQuestPath() {
  questPathEl.innerHTML = "";
  quizQuestions.forEach((_, i) => {
    const stop = document.createElement("div");
    stop.className = "stop" + (i === 0 ? " current" : "");
    stop.id = "stop-" + i;
    questPathEl.appendChild(stop);
    if (i < quizQuestions.length - 1) {
      const line = document.createElement("div");
      line.className = "line";
      questPathEl.appendChild(line);
    }
  });
}

function updateQuestPath(index, result) {
  const stop = document.getElementById("stop-" + index);
  if (!stop) return;
  stop.classList.remove("current");
  stop.classList.add(result); // "done" or "wrong"
  const next = document.getElementById("stop-" + (index + 1));
  if (next) next.classList.add("current");
}

/* ---------- Question flow ---------- */

function showQuestion() {
  answered = false;
  const q = quizQuestions[currentIndex];
  const letters = ["A", "B", "C", "D"];

  gameArea.innerHTML = `
    <div class="card q-card">
      <span class="q-level-badge">${q.level} · Question ${currentIndex + 1} of ${quizQuestions.length}</span>
      <div class="q-text">${escapeHtml(q.question)}</div>
      <div class="answers" id="answersList"></div>
    </div>
  `;

  const list = document.getElementById("answersList");
  const shuffledOptions = shuffle(q.options);

  shuffledOptions.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerHTML = `<span class="letter">${letters[i]}</span><span>${escapeHtml(opt)}</span>`;
    btn.addEventListener("click", () => selectAnswer(btn, opt, q.correct));
    list.appendChild(btn);
  });

  resetSpeech("Ready? Pick your answer!", "");
  startTimer();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = SECONDS_PER_QUESTION;
  hudTimer.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    hudTimer.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      if (!answered) handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  answered = true;
  document.querySelectorAll(".answer-btn").forEach((b) => (b.disabled = true));
  streak = 0;
  hudStreak.textContent = streak;
  updateQuestPath(currentIndex, "wrong");
  reactMascot(false, "Time's up! Let's keep going.");
  advanceAfterDelay();
}

function selectAnswer(btn, chosen, correct) {
  if (answered) return;
  answered = true;
  clearInterval(timerInterval);

  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((b) => (b.disabled = true));

  const isCorrect = chosen === correct;

  buttons.forEach((b) => {
    const label = b.textContent.trim();
    if (label.endsWith(correct)) b.classList.add("correct");
  });

  if (isCorrect) {
    const timeBonus = Math.max(0, timeLeft);
    score += 10 + timeBonus;
    streak += 1;
    hudScore.textContent = score;
    hudStreak.textContent = streak;
    updateQuestPath(currentIndex, "done");
    reactMascot(true, streak >= 3 ? `On fire! ${streak} in a row!` : "Correct! Nice work.");
  } else {
    btn.classList.add("wrong");
    streak = 0;
    hudStreak.textContent = streak;
    updateQuestPath(currentIndex, "wrong");
    reactMascot(false, `Not quite — it was "${correct}".`);
  }

  advanceAfterDelay();
}

function advanceAfterDelay() {
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < quizQuestions.length) {
      showQuestion();
    } else {
      finishGame();
    }
  }, 1400);
}

/* ---------- Mascot reactions ---------- */

function resetSpeech(text) {
  speechBubble.textContent = text;
  speechBubble.className = "speech-bubble show";
}

function reactMascot(good, text) {
  speechBubble.textContent = text;
  speechBubble.className = "speech-bubble show " + (good ? "good" : "bad");
  mascotBody.forEach((el) => {
    if (el.getAttribute("fill") === "#7C6BB5") {
      el.setAttribute("fill", good ? "#4CAF7D" : "#FF6B6B");
    }
  });
  setTimeout(() => {
    mascotBody.forEach((el) => {
      if (el.getAttribute("fill") === "#4CAF7D" || el.getAttribute("fill") === "#FF6B6B") {
        el.setAttribute("fill", "#7C6BB5");
      }
    });
  }, 900);
}

/* ---------- Finish ---------- */

async function finishGame() {
  questPathEl.style.display = "none";

  gameArea.innerHTML = `
    <div class="card result-hero">
      <div class="q-level-badge">${player.level} Quest Complete</div>
      <div class="score-big">${score}</div>
      <div class="score-lbl">Final Score</div>
      <p class="muted mt">Best streak stat is saved to the leaderboard too.</p>
      <div class="row-gap mt">
        <button class="btn leaf" onclick="window.location.href='leaderboard.html'">🏆 View Leaderboard</button>
        <button class="btn ghost" onclick="window.location.href='index.html'">Play Again</button>
      </div>
    </div>
  `;

  resetSpeech(score >= 80 ? "Amazing quest, champion! 🎉" : "Great effort! Keep leveling up.");

  try {
    await apiCall({
      action: "submitScore",
      name: player.name,
      className: player.className,
      level: player.level,
      score,
      streak,
    });
  } catch (err) {
    console.warn("Could not save score to the leaderboard:", err.message);
  }
}

loadQuestions();
