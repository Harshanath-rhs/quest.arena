/* ==========================================================
   LOCAL QUESTION BANK
   This is the "built into the site" half of your question mix.
   Add/edit questions here any time — no deploy step needed,
   just edit this file and push to GitHub.

   The other half comes live from the "Questions" tab in your
   Google Sheet (see README.md), and game.js merges both lists
   together and shuffles them.

   Each question needs: level ("Easy" | "Medium" | "Hard"),
   question text, 4 options, and the correct option text
   (must match one of the options exactly).
   ========================================================== */

const LOCAL_QUESTIONS = [
  // ----- Easy -----
  { level: "Easy", question: "Choose the correct word: She ___ a teacher.", options: ["is", "am", "are", "be"], correct: "is" },
  { level: "Easy", question: "What is the plural of 'cat'?", options: ["cats", "cates", "cat's", "catss"], correct: "cats" },
  { level: "Easy", question: "Fill the blank: I ___ happy today.", options: ["am", "is", "are", "be"], correct: "am" },
  { level: "Easy", question: "Which word means the opposite of 'big'?", options: ["small", "tall", "loud", "fast"], correct: "small" },
  { level: "Easy", question: "Choose the correct sentence.", options: ["They is playing.", "They am playing.", "They are playing.", "They be playing."], correct: "They are playing." },
  { level: "Easy", question: "What color is the sun?", options: ["Yellow", "Blue", "Green", "Purple"], correct: "Yellow" },
  { level: "Easy", question: "Complete: This ___ my dog.", options: ["is", "are", "am", "be"], correct: "is" },
  { level: "Easy", question: "Choose the correct spelling.", options: ["frend", "friend", "freind", "frind"], correct: "friend" },

  // ----- Medium -----
  { level: "Medium", question: "Choose the correct past tense: Yesterday, I ___ to school.", options: ["go", "goed", "went", "gone"], correct: "went" },
  { level: "Medium", question: "Pick the correct sentence.", options: ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."], correct: "He doesn't like tea." },
  { level: "Medium", question: "Choose the correct word: There ___ many books on the shelf.", options: ["is", "are", "was", "be"], correct: "are" },
  { level: "Medium", question: "What is the opposite of 'difficult'?", options: ["easy", "hard", "heavy", "slow"], correct: "easy" },
  { level: "Medium", question: "Choose the correct word: I have ___ apple.", options: ["a", "an", "the", "some"], correct: "an" },
  { level: "Medium", question: "Fill in: She is taller ___ her brother.", options: ["from", "then", "than", "that"], correct: "than" },
  { level: "Medium", question: "Choose the correct sentence.", options: ["Where is my keys?", "Where are my keys?", "Where be my keys?", "Where am my keys?"], correct: "Where are my keys?" },
  { level: "Medium", question: "Pick the correctly spelled word.", options: ["beatiful", "beautiful", "beutiful", "beautifull"], correct: "beautiful" },

  // ----- Hard -----
  { level: "Hard", question: "Choose the correct sentence (present perfect).", options: ["I have saw that movie.", "I have seen that movie.", "I has seen that movie.", "I having seen that movie."], correct: "I have seen that movie." },
  { level: "Hard", question: "Pick the correctly punctuated sentence.", options: ["Its raining outside.", "It's raining outside.", "Its' raining outside.", "Its raining, outside."], correct: "It's raining outside." },
  { level: "Hard", question: "Choose the correct word: If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], correct: "were" },
  { level: "Hard", question: "Which sentence uses the passive voice correctly?", options: ["The cake was baked by her.", "The cake baked her.", "Her was baked the cake.", "The cake baking by her."], correct: "The cake was baked by her." },
  { level: "Hard", question: "Choose the correct word: Neither of the answers ___ correct.", options: ["is", "are", "were", "be"], correct: "is" },
  { level: "Hard", question: "Pick the sentence with the correct word order.", options: ["Always she is late.", "She is always late.", "She always is late.", "Is she always late always."], correct: "She is always late." },
];
