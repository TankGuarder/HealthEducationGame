const screens = {
  login: document.querySelector("#loginView"),
  game: document.querySelector("#gameView"),
  video: document.querySelector("#videoView"),
  quiz: document.querySelector("#quizView"),
  leaderboard: document.querySelector("#leaderboardView"),
};

const text = {
  level: "\u7b2c",
  gate: "\u95dc",
  remaining: "\u5269\u9918",
  canNext: "\u53ef\u4ee5\u9032\u5165\u4e0b\u4e00\u95dc",
  chooseAnswer: "\u8acb\u5148\u9078\u64c7\u4e00\u500b\u7b54\u6848\u3002",
  wrongAnswer: "\u7b54\u932f\u4e86\uff0c\u672c\u6b21\u904a\u6232\u7d50\u675f\u3002",
  badName: "\u8acb\u8f38\u5165 2 \u5230 18 \u5b57\uff0c\u53ef\u4f7f\u7528\u4e2d\u82f1\u6587\u3001\u6578\u5b57\u3001\u5e95\u7dda\u6216\u9023\u5b57\u865f\u3002",
  duplicateName: "\u9019\u500b\u4f7f\u7528\u8005\u540d\u7a31\u5df2\u7d93\u6709\u4eba\u4f7f\u7528\uff0c\u8acb\u63db\u4e00\u500b\u3002",
};

const tiles = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const levels = [
  {
    title: "\u98f2\u98df\u5747\u8861",
    goal: "\u5b8c\u6210 8 \u7d44\u914d\u5c0d\uff0c\u8a8d\u8b58\u6bcf\u65e5\u71df\u990a\u3002",
    pairs: 8,
    size: 4,
    video: "\u5747\u8861\u98f2\u98df\u8207\u4efd\u91cf\u6982\u5ff5",
    quiz: {
      question: "\u4e0b\u5217\u54ea\u4e00\u9805\u6bd4\u8f03\u7b26\u5408\u5747\u8861\u98f2\u98df\uff1f",
      options: [
        "\u6bcf\u5929\u53ea\u5403\u540c\u4e00\u7a2e\u98df\u7269",
        "\u651d\u53d6\u591a\u7a2e\u985e\u98df\u7269\u4e26\u6ce8\u610f\u4efd\u91cf",
        "\u5b8c\u5168\u4e0d\u559d\u6c34",
      ],
      answer: 1,
    },
  },
  {
    title: "\u8eab\u9ad4\u6d3b\u52d5",
    goal: "\u5b8c\u6210 12 \u7d44\u914d\u5c0d\uff0c\u5716\u793a\u7a2e\u985e\u589e\u52a0\u3002",
    pairs: 12,
    size: 5,
    video: "\u898f\u5f8b\u904b\u52d5\u8207\u4e45\u5750\u63d0\u9192",
    quiz: {
      question: "\u9577\u6642\u9593\u5750\u8457\u6642\uff0c\u5efa\u8b70\u600e\u9ebc\u505a\uff1f",
      options: [
        "\u5076\u723e\u8d77\u8eab\u6d3b\u52d5",
        "\u5b8c\u5168\u4e0d\u52d5\u6bd4\u8f03\u7701\u529b",
        "\u53ea\u8981\u5403\u96f6\u98df\u5373\u53ef",
      ],
      answer: 0,
    },
  },
  {
    title: "\u751f\u6d3b\u4fdd\u5065",
    goal: "\u5b8c\u6210 18 \u7d44\u914d\u5c0d\uff0c\u68cb\u76e4\u66f4\u5927\u4e5f\u66f4\u96e3\u3002",
    pairs: 18,
    size: 6,
    video: "\u7761\u7720\u3001\u6e05\u6f54\u8207\u58d3\u529b\u8abf\u9069",
    quiz: {
      question: "\u7dad\u6301\u5065\u5eb7\u751f\u6d3b\uff0c\u4e0b\u5217\u54ea\u4e00\u9805\u8f03\u9069\u5408\uff1f",
      options: [
        "\u56fa\u5b9a\u7761\u7720\u4e26\u6ce8\u610f\u6e05\u6f54",
        "\u71ac\u591c\u5f8c\u4e0d\u9700\u8981\u4f11\u606f",
        "\u8eab\u9ad4\u4e0d\u8212\u670d\u4e5f\u4e0d\u7528\u6c42\u52a9",
      ],
      answer: 0,
    },
  },
];

const seedScores = [
  { name: "alpha12", score: 55 },
  { name: "care88", score: 45 },
  { name: "green5", score: 35 },
  { name: "focus20", score: 25 },
];

const state = {
  player: "",
  score: 0,
  levelIndex: 0,
  matches: 0,
  selected: null,
  lock: false,
  timeLeft: 60,
  timerId: null,
  extendedThisLevel: false,
  videoId: null,
  videoTime: 30,
};

const $ = (selector) => document.querySelector(selector);

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
}

function getPlayers() {
  return JSON.parse(localStorage.getItem("health-game-players") || "[]");
}

function savePlayers(players) {
  localStorage.setItem("health-game-players", JSON.stringify(players));
}

function getScores() {
  return JSON.parse(localStorage.getItem("health-game-scores") || JSON.stringify(seedScores));
}

function saveScores(scores) {
  localStorage.setItem("health-game-scores", JSON.stringify(scores));
}

function updateHud() {
  const level = levels[state.levelIndex];
  $("#playerName").textContent = state.player;
  $("#levelLabel").textContent = `${text.level} ${state.levelIndex + 1} ${text.gate}`;
  $("#score").textContent = state.score;
  $("#timer").textContent = state.timeLeft;
  $("#target").textContent = level.pairs;
  $("#levelTitle").textContent = level.title;
  $("#levelGoal").textContent = level.goal;
  $("#progressText").textContent = `${state.matches} / ${level.pairs}`;
  $("#progressBar").style.width = `${Math.min(100, (state.matches / level.pairs) * 100)}%`;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeDeck(level) {
  const needed = Math.ceil((level.size * level.size) / 2);
  const symbols = Array.from({ length: needed }, (_, index) => tiles[index % tiles.length]);
  const deck = shuffle([...symbols, ...symbols]).slice(0, level.size * level.size);
  if (deck.length % 2 === 1) deck.pop();
  return shuffle(deck);
}

function renderBoard() {
  const level = levels[state.levelIndex];
  const board = $("#board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${level.size}, 1fr)`;

  makeDeck(level).forEach((symbol, index) => {
    const button = document.querySelector("#tileTemplate").content.firstElementChild.cloneNode(true);
    button.textContent = symbol;
    button.dataset.symbol = symbol;
    button.dataset.index = index;
    button.addEventListener("click", () => selectTile(button));
    board.appendChild(button);
  });
}

function startLevel() {
  clearInterval(state.timerId);
  state.matches = 0;
  state.selected = null;
  state.lock = false;
  state.timeLeft = 60;
  state.extendedThisLevel = false;
  renderBoard();
  updateHud();
  showScreen("game");
  state.timerId = setInterval(tick, 1000);
}

function tick() {
  state.timeLeft -= 1;
  updateHud();
  if (state.timeLeft <= 0) {
    clearInterval(state.timerId);
    if (state.matches >= levels[state.levelIndex].pairs) {
      completeLevel();
    } else if (!state.extendedThisLevel) {
      openQuiz();
    } else {
      endGame();
    }
  }
}

function selectTile(tile) {
  if (state.lock || tile.classList.contains("tile--matched") || tile === state.selected) return;

  tile.classList.add("tile--selected");
  if (!state.selected) {
    state.selected = tile;
    return;
  }

  const first = state.selected;
  const second = tile;
  state.selected = null;

  if (first.dataset.symbol === second.dataset.symbol) {
    first.classList.add("tile--matched");
    second.classList.add("tile--matched");
    first.classList.remove("tile--selected");
    second.classList.remove("tile--selected");
    state.matches += 1;
    updateHud();
    if (state.matches >= levels[state.levelIndex].pairs) completeLevel();
    return;
  }

  state.lock = true;
  setTimeout(() => {
    first.classList.remove("tile--selected");
    second.classList.remove("tile--selected");
    state.lock = false;
  }, 520);
}

function completeLevel() {
  clearInterval(state.timerId);
  state.score += 10;
  updateHud();
  if (state.levelIndex >= levels.length - 1) {
    endGame();
  } else {
    startVideo();
  }
}

function startVideo() {
  const level = levels[state.levelIndex];
  state.videoTime = 30;
  $("#videoTopic").textContent = level.video;
  $("#nextLevelBtn").disabled = true;
  $("#videoBar").style.width = "0%";
  $("#videoCountdown").textContent = `${text.remaining} 30 \u79d2`;
  showScreen("video");

  clearInterval(state.videoId);
  state.videoId = setInterval(() => {
    state.videoTime -= 1;
    const watched = 30 - state.videoTime;
    $("#videoBar").style.width = `${(watched / 30) * 100}%`;
    $("#videoCountdown").textContent = state.videoTime > 0 ? `${text.remaining} ${state.videoTime} \u79d2` : text.canNext;
    if (state.videoTime <= 0) {
      clearInterval(state.videoId);
      $("#nextLevelBtn").disabled = false;
    }
  }, 1000);
}

function openQuiz() {
  const quiz = levels[state.levelIndex].quiz;
  state.extendedThisLevel = true;
  state.score -= 5;
  $("#quizQuestion").textContent = quiz.question;
  $("#quizFeedback").textContent = "";
  $("#quizOptions").innerHTML = "";
  quiz.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "option";
    label.innerHTML = `<input type="radio" name="quiz" value="${index}" /> <span>${option}</span>`;
    $("#quizOptions").appendChild(label);
  });
  showScreen("quiz");
}

function submitQuiz() {
  const selected = document.querySelector('input[name="quiz"]:checked');
  if (!selected) {
    $("#quizFeedback").textContent = text.chooseAnswer;
    return;
  }

  const isCorrect = Number(selected.value) === levels[state.levelIndex].quiz.answer;
  if (!isCorrect) {
    $("#quizFeedback").textContent = text.wrongAnswer;
    setTimeout(endGame, 900);
    return;
  }

  state.timeLeft = 10;
  updateHud();
  showScreen("game");
  state.timerId = setInterval(tick, 1000);
}

function endGame() {
  clearInterval(state.timerId);
  clearInterval(state.videoId);
  const scores = getScores();
  scores.push({ name: state.player, score: state.score });
  scores.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  saveScores(scores);
  renderLeaderboard(scores);
  showScreen("leaderboard");
}

function renderLeaderboard(scores) {
  const topTen = scores.slice(0, 10);
  $("#topTen").innerHTML = topTen
    .map((entry, index) => `<li><span class="rank">#${index + 1}</span><span>${entry.name}</span><strong>${entry.score}</strong></li>`)
    .join("");

  const myRank = scores.findIndex((entry) => entry.name === state.player && entry.score === state.score) + 1;
  $("#myRank").innerHTML = `<span class="rank">#${myRank}</span><span>${state.player}</span><strong>${state.score}</strong>`;
}

$("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#username").value.trim();
  const players = getPlayers();

  if (!/^[\w\u4e00-\u9fa5-]{2,18}$/.test(name)) {
    $("#loginError").textContent = text.badName;
    return;
  }

  if (players.includes(name)) {
    $("#loginError").textContent = text.duplicateName;
    return;
  }

  players.push(name);
  savePlayers(players);
  state.player = name;
  state.score = 0;
  state.levelIndex = 0;
  $("#loginError").textContent = "";
  startLevel();
});

$("#nextLevelBtn").addEventListener("click", () => {
  state.levelIndex += 1;
  startLevel();
});

$("#submitQuizBtn").addEventListener("click", submitQuiz);
$("#finishFromQuizBtn").addEventListener("click", endGame);
$("#restartBtn").addEventListener("click", () => {
  state.player = "";
  state.score = 0;
  state.levelIndex = 0;
  $("#username").value = "";
  showScreen("login");
});
