const gameContainer = document.querySelector(".game-container");
const fieldContainer = document.querySelector(".field-container");
const fieldSize = 3;
const sessionStorageElCount = 3;

let players = [
  { name: "", score: 0 },
  { name: "", score: 0 },
];
// true - x, false - 0
let currentPlayer = true;
// track the state of the game
let gameState = ["", "", "", "", "", "", "", "", ""];
// winning conditions
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// creates fields
function createFields() {
  for (let i = 0; i < fieldSize * fieldSize; i++) {
    const field = document.createElement("button");
    field.addEventListener("click", handleFieldClick);
    field.id = i;
    field.classList.add("field", "active-field");
    fieldContainer.appendChild(field);
  }
}

// click handler
function handleFieldClick() {
  if (currentPlayer) {
    this.innerHTML = `<i class="icon fa-solid fa-x"></i>`;
    gameState[parseInt(this.id)] = "X";
  } else {
    this.innerHTML = `<i class="icon fa-regular fa-circle"></i>`;
    gameState[parseInt(this.id)] = "O";
  }

  this.removeEventListener("click", handleFieldClick);
  this.classList.remove("active-field");

  validateResults(false);
  updateSessionStorage();

  currentPlayer = !currentPlayer;
}

// remove active class and click handler
function makeInactive() {
  const fields = document.querySelectorAll(".field");
  fields.forEach((field) => {
    field.classList.remove("active-field");
    field.removeEventListener("click", handleFieldClick);
  });
}

// checks for draw or winning
function validateResults(loading) {
  let won = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];

    if (a === "" || b === "" || c === "") {
      continue;
    }

    if (a === b && b === c) {
      won = true;
      break;
    }
  }

  // detect winning
  if (won) {
    handleWin(loading);
    return;
  }

  // detect draw
  let draw = !gameState.includes("");
  if (draw) {
    addPlayAgainMessage("Žaidimas baigėsi lygiosiomis!");
    makeInactive();
    return;
  }
}

function addPlayAgainMessage(result) {
  if (document.querySelector(".play-again-container")) return;
  const gameInfo = document.querySelector(".game-info");
  const div = document.createElement("div");
  div.classList.add("play-again-container");
  div.innerHTML = `
        <h2 id="play-again-message">${result}</h2>
        <div class="animation-container">
          <i class="animated-icon fa-sharp fa-solid fa-arrow-right"></i>
          <button class="play-again-button" onclick="resetGame()">Žaisti dar kartą</button>
          <i class="animated-icon-reversed fa-sharp fa-solid fa-arrow-left"></i>
        </div>
`;
  gameInfo.appendChild(div);
}

function removePlayAgainMessage() {
  if (document.querySelector(".play-again-container"))
    document.querySelector(".play-again-container").remove();
}

function getPlayerInfo() {
  document.querySelector(".menu").classList.add("hidden");
  createGrid();
  updateSessionStorage();
}

function createGrid() {
  setPlayerNames();
  createFields();
  document.querySelector(".game-container").classList.remove("hidden");
}

function handleWin(loading) {
  currentPlayer
    ? addPlayAgainMessage(`${players[0].name} laimėjo!`)
    : addPlayAgainMessage(`${players[1].name} laimėjo!`);
  makeInactive();
  if (!loading) currentPlayer ? players[0].score++ : players[1].score++;
  setPlayerNames();
}

function setPlayerNames() {
  players[0].name = document.getElementById("player1").value;
  players[1].name = document.getElementById("player2").value;

  if (players[0].name === "") players[0].name = "Žaidėjas1";
  if (players[1].name === "") players[1].name = "Žaidėjas2";

  document.getElementById("scoreboard").innerText =
    players[0].name +
    " (X) " +
    players[0].score +
    " - " +
    players[1].score +
    " " +
    players[1].name +
    " (O) ";
}

function resetGame() {
  document.querySelectorAll(".field").forEach((field) => field.remove());
  currentPlayer = true;
  gameState = ["", "", "", "", "", "", "", "", ""];
  createFields();
  removePlayAgainMessage();
  updateSessionStorage();
}

function resetScore() {
  players[0].score = 0;
  players[1].score = 0;
  setPlayerNames();
  updateSessionStorage();
}

function exitGame() {
  document.querySelector(".game-container").classList.add("hidden");
  document.querySelector(".menu").classList.remove("hidden");
  document.querySelectorAll(".field").forEach((field) => field.remove());
  removePlayAgainMessage();
  gameState = ["", "", "", "", "", "", "", "", ""];
  players = [
    { name: "", score: 0 },
    { name: "", score: 0 },
  ];
  currentPlayer = true;
  sessionStorage.clear();
}

function updateSessionStorage() {
  sessionStorage.setItem("players", JSON.stringify(players));
  sessionStorage.setItem("currentPlayer", JSON.stringify(currentPlayer));
  sessionStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadFromSessionStorage() {
  if (sessionStorage.length === sessionStorageElCount) {
    removePlayAgainMessage();
    players = JSON.parse(sessionStorage.getItem("players"));
    currentPlayer = JSON.parse(sessionStorage.getItem("currentPlayer"));
    gameState = JSON.parse(sessionStorage.getItem("gameState"));
    createGrid();
    document.querySelectorAll(".field").forEach((field) => {
      if (gameState[parseInt(field.id)] === "X") {
        field.innerHTML = `<i class="icon fa-solid fa-x"></i>`;
        field.removeEventListener("click", handleFieldClick);
        field.classList.remove("active-field");
      } else if (gameState[parseInt(field.id)] === "O") {
        field.innerHTML = `<i class="icon fa-regular fa-circle"></i>`;
        field.removeEventListener("click", handleFieldClick);
        field.classList.remove("active-field");
      }
    });
    validateResults(true);
  } else {
    document.querySelector(".menu").classList.remove("hidden");
  }
}

loadFromSessionStorage();

const modals = document.querySelectorAll("[data-modal]");

modals.forEach(function (trigger) {
  trigger.addEventListener("click", function (event) {
    event.preventDefault();
    const modal = document.getElementById(trigger.dataset.modal);
    modal.classList.add("open");
    const exits = modal.querySelectorAll(".modal-exit");
    exits.forEach(function (exit) {
      exit.addEventListener("click", function (event) {
        event.preventDefault();
        modal.classList.remove("open");
      });
    });
  });
});
