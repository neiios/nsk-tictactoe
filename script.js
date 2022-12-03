const gameContainer = document.querySelector(".game-container");
const fieldSize = 3;
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
    gameContainer.appendChild(field);
  }
}

// click handler
function handleFieldClick() {
  if (currentPlayer) {
    this.innerHTML = `<i class="icon fa-sharp fa-solid fa-xmark"></i>`;
    gameState[parseInt(this.id)] = "X";
  } else {
    this.innerHTML = `<i class="icon fa-regular fa-circle"></i>`;
    gameState[parseInt(this.id)] = "O";
  }
  currentPlayer = !currentPlayer;

  this.removeEventListener("click", handleFieldClick);
  this.classList.remove("active-field");

  validateResults();
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
    alert("You have won!");
    makeInactive();
    return;
  }

  // detect draw
  let draw = !gameState.includes("");
  if (draw) {
    alert("Draw!");
    makeInactive();
    return;
  }
}

// call functions
createFields();
