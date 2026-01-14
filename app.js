const tg = window.Telegram.WebApp;
tg.expand();

const cardsDiv = document.getElementById("cards");
const boardDiv = document.getElementById("board");
const drawnDiv = document.getElementById("drawnNumbers");

let selectedCard = null;
let playerBoard = null;
let drawnNumbers = [];

// Generate 1–100 cards
for (let i = 1; i <= 100; i++) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerText = i;

  card.onclick = () => {
    selectedCard = i;
    tg.sendData("card_" + i);
    highlightSelectedCard();
    if (!playerBoard) buildPlayerBoard();
  };

  cardsDiv.appendChild(card);
}

function highlightSelectedCard() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach(c => {
    c.style.background = c.innerText == selectedCard ? "green" : "white";
  });
}

function buildPlayerBoard() {
  if (!selectedCard) return;

  const seed = parseInt(selectedCard) * 42;
  function randArr(min, max, count) {
    let arr = [];
    while (arr.length < count) {
      let n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!arr.includes(n)) arr.push(n);
    }
    return arr;
  }

  const card = {
    B: randArr(1, 15, 5),
    I: randArr(16, 30, 5),
    N: randArr(31, 45, 5),
    G: randArr(46, 60, 5),
    O: randArr(61, 75, 5),
  };
  card.N[2] = "*";
  playerBoard = card;

  renderBoard();
}

function renderBoard() {
  if (!playerBoard) return;
  boardDiv.innerHTML = "";
  const cols = ["B","I","N","G","O"];
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const val = playerBoard[cols[col]][row];
      cell.dataset.number = val;
      cell.innerText = val;
      if(val === "*") cell.classList.add("free");
      boardDiv.appendChild(cell);
    }
  }
}

function displayDrawnNumbers(numbers) {
  drawnNumbers = numbers;
  drawnDiv.innerHTML = "";
  numbers.forEach(num => {
    const span = document.createElement("span");
    span.className = "drawn";
    span.innerText = num;
    drawnDiv.appendChild(span);
  });
  highlightBoard();
}

function highlightBoard() {
  if (!playerBoard) return;
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    const val = cell.dataset.number;
    cell.classList.remove("drawn","bingo");
    if (val === "*" || drawnNumbers.includes(parseInt(val))) cell.classList.add("drawn");
  });
  checkBingo();
}

function checkBingo() {
  if (!playerBoard) return;
  const cols = ["B","I","N","G","O"];
  const matrix = [];
  for (let row = 0; row < 5; row++) {
    matrix[row] = [];
    for (let col = 0; col < 5; col++) {
      const val = playerBoard[cols[col]][row];
      matrix[row][col] = val === "*" || drawnNumbers.includes(parseInt(val));
    }
  }

  for (let r=0;r<5;r++){
    if(matrix[r].every(v=>v)){ markBingoCells(r,"row"); return; }
  }
  for (let c=0;c<5;c++){
    if(matrix.map(r=>r[c]).every(v=>v)){ markBingoCells(c,"col"); return; }
  }
  if(matrix.map((r,i)=>r[i]).every(v=>v)) markBingoCells("diag1","diag");
  if(matrix.map((r,i)=>r[4-i]).every(v=>v)) markBingoCells("diag2","diag");
}

function markBingoCells(index,type){
  const cells = document.querySelectorAll(".cell");
  if(type==="row"){ for(let i=0;i<5;i++) cells[index*5+i].classList.add("bingo"); }
  else if(type==="col"){ for(let i=0;i<5;i++) cells[i*5+index].classList.add("bingo"); }
  else if(type==="diag"){
    for(let i=0;i<5;i++){
      if(index==="diag1") cells[i*5+i].classList.add("bingo");
      if(index==="diag2") cells[i*5+4-i].classList.add("bingo");
    }
  }
  alert("🎉 Bingo! You won!");
}

tg.onEvent("web_app_data", function(event){
  const data = event.data;
  if(data.startsWith("drawn_")){
    const numbers = data.replace("drawn_","").split(",").map(Number);
    displayDrawnNumbers(numbers);
  }
});
