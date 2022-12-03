const gameContainer = document.querySelector(".game-container");
const fieldContainer = document.querySelector(".field-container");
const fieldSize = 3;

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

  validateResults();
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
function validateResults() {
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
    handleWin();
    return;
  }

  // detect draw
  let draw = !gameState.includes("");
  if (draw) {
    alert("Draw!");
    handleDraw();
    makeInactive();
    return;
  }
}

function getPlayerInfo() {
  document.querySelector(".menu").classList.add("hidden");
  setPlayerNames();
  createFields();
  document.querySelector(".game-container").classList.remove("hidden");
}

// function toggleAnotherGameButton() {
//   if (document.querySelector(".another-game")) {
//     document.querySelector(".another-game").remove();
//     const button = document.createElement("button");
//     button.classList.add("reset-game");
//     button.innerText = "Reset game";
//     button.addEventListener("click", resetGame);
//     gameContainer.appendChild(button);
//   } else {
//     document.querySelector(".reset-game").remove();
//     const button = document.createElement("button");
//     button.classList.add("another-game");
//     button.innerText = "Play another game";
//     button.addEventListener("click", resetGame);
//     gameContainer.appendChild(button);
//   }
// }

function handleWin() {
  alert("You have won!");
  makeInactive();
  currentPlayer ? players[0].score++ : players[1].score++;
  setPlayerNames();
  // toggleAnotherGameButton();
}

function setPlayerNames() {
  players[0].name = document.getElementById("player1").value;
  players[1].name = document.getElementById("player2").value;
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
}

function exitGame() {
  document.querySelector(".game-container").classList.add("hidden");
  document.querySelector(".menu").classList.remove("hidden");
  document.querySelectorAll(".field").forEach((field) => field.remove());
  players = [
    { name: "", score: 0 },
    { name: "", score: 0 },
  ];
  currentPlayer = true;
}
