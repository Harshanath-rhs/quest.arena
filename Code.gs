/* ==========================================================
   WORD QUEST ARENA — Apps Script backend
   Paste this whole file into Extensions > Apps Script on your
   Google Sheet, then deploy as a Web App (see README.md).

   Expects 3 sheet tabs, with these exact header rows:

   "Students"  -> Name | Class | PIN
   "Questions" -> Level | Question | OptionA | OptionB | OptionC | OptionD | Correct
   "Scores"    -> Name | Class | Level | Score | Streak | Date
   ========================================================== */

function doGet(e) {
  var action = e.parameter.action;
  var callback = e.parameter.callback;
  var result;

  try {
    if (action === "login") {
      result = handleLogin(e.parameter);
    } else if (action === "getQuestions") {
      result = getQuestions(e.parameter.level);
    } else if (action === "submitScore") {
      result = submitScore(e.parameter);
    } else if (action === "getLeaderboard") {
      result = getLeaderboard();
    } else {
      result = { success: false, message: "Unknown action: " + action };
    }
  } catch (err) {
    result = { success: false, message: "Server error: " + err.message };
  }

  var output = callback + "(" + JSON.stringify(result) + ")";
  return ContentService.createTextOutput(output).setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function getSheet(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Sheet tab "' + name + '" not found.');
  return sheet;
}

/* ---------- Login: checks Name + PIN against Students tab ---------- */
function handleLogin(params) {
  var sheet = getSheet("Students");
  var data = sheet.getDataRange().getValues(); // Name, Class, PIN

  for (var i = 1; i < data.length; i++) {
    var rowName = String(data[i][0]).trim().toLowerCase();
    var rowPin = String(data[i][2]).trim();
    if (rowName === String(params.name).trim().toLowerCase() && rowPin === String(params.pin).trim()) {
      return { success: true, name: data[i][0], className: data[i][1] };
    }
  }
  return { success: false, message: "Name or PIN not found. Check with your teacher." };
}

/* ---------- Questions: returns extra questions for a given level ---------- */
function getQuestions(level) {
  var sheet = getSheet("Questions");
  var data = sheet.getDataRange().getValues(); // Level, Question, A, B, C, D, Correct
  var out = [];

  for (var i = 1; i < data.length; i++) {
    if (!data[i][1]) continue; // skip blank rows
    if (!level || String(data[i][0]).trim() === String(level).trim()) {
      out.push({
        level: data[i][0],
        question: data[i][1],
        options: [data[i][2], data[i][3], data[i][4], data[i][5]],
        correct: data[i][6],
      });
    }
  }
  return { success: true, questions: out };
}

/* ---------- Scores: appends a row to the Scores tab ---------- */
function submitScore(params) {
  var sheet = getSheet("Scores");
  sheet.appendRow([
    params.name,
    params.className,
    params.level,
    Number(params.score) || 0,
    Number(params.streak) || 0,
    new Date(),
  ]);
  return { success: true };
}

/* ---------- Leaderboard: best score per student, top 20 ---------- */
function getLeaderboard() {
  var sheet = getSheet("Scores");
  var data = sheet.getDataRange().getValues(); // Name, Class, Level, Score, Streak, Date
  var best = {};

  for (var i = 1; i < data.length; i++) {
    var name = data[i][0];
    if (!name) continue;
    var score = Number(data[i][3]) || 0;
    if (!best[name] || score > best[name].score) {
      best[name] = { name: name, className: data[i][1], level: data[i][2], score: score };
    }
  }

  var arr = Object.keys(best).map(function (k) { return best[k]; });
  arr.sort(function (a, b) { return b.score - a.score; });

  return { success: true, leaderboard: arr.slice(0, 20) };
}
