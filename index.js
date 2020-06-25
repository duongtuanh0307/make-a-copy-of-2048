const KEY_CODE = {
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40,
};
const boardGame = document.querySelector("#game");
const notification = document.querySelector("#notification");
const scoreDisplay = document.querySelector("#score");
const highScoreDisplay = document.querySelector("#high-score");
let cells = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

/*--------------Handling Game function----------------------*/

function renderBoard(data) {
  const renderDatas = data.reduce(
    (prev, row) =>
      prev +
      row.reduce((_prev, item) => {
        const cell =
          item !== 0
            ? `<div class='cell cell_${item}'><p>${item}</p></div>`
            : `<div class='cell cell_${item}'></div>`;
        return _prev + cell;
      }, ""),
    ""
  );

  boardGame.innerHTML = `${renderDatas}`; //render board
}

function renderScore() {
  let scoreValue = `
  <p>SCORE:
  <span>${score}</span></p>
  `;
  scoreDisplay.innerHTML = scoreValue; //display score
  if (highScore < score) {
    highScore = score;
    localStorage.removeItem("highScore");
    localStorage.setItem("highScore", highScore);
  }
  let highScoreValue = `
      <p>BEST:
      <span>${highScore}</span></p>
      `;
  highScoreDisplay.innerHTML = highScoreValue;
}

//renderGame
function renderGame(data) {
  renderBoard(data);
  renderScore();
}

//handle behaviour when user press keyboard
function handleGame(e) {
  e.preventDefault();
  switch (e.keyCode) {
    case KEY_CODE.ARROW_LEFT:
      cells = handleMove(cells);
      break;
    case KEY_CODE.ARROW_UP:
      cells = rotateAntiClockwise(cells);
      cells = handleMove(cells);
      cells = rotateClockwise(cells);
      break;
    case KEY_CODE.ARROW_RIGHT:
      cells = rotateAntiClockwise(cells);
      cells = rotateAntiClockwise(cells);
      cells = handleMove(cells);
      cells = rotateClockwise(cells);
      cells = rotateClockwise(cells);
      break;
    case KEY_CODE.ARROW_DOWN:
      cells = rotateClockwise(cells);
      cells = handleMove(cells);
      cells = rotateAntiClockwise(cells);
      break;
  }
  renderGame(cells);
}

// process as all cells move to the left
function handleMove(targetBoard) {
  let numList = [];
  targetBoard.forEach((row, j) => {
    let targetRow = row;
    targetRow = sliceArr(sumUp(sliceArr(targetRow)));
    targetBoard[j] = targetRow;
    numList = [...numList, ...targetRow];
  });

  if (numList.includes(0)) {
    addNum(targetBoard);
  } else if (!checkGameEnd(targetBoard)) {
    endGame();
  }
  return targetBoard;
}

//rotate board 90 degrees clockwise
function rotateClockwise(targetBoard) {
  const output = targetBoard.map((row, i) =>
    row.map((_, j) => targetBoard[targetBoard.length - 1 - j][i])
  );

  return output;
}

//rotate board 90 degrees anticlockwise
function rotateAntiClockwise(targetBoard) {
  const output = targetBoard.map((row, i) =>
    row.map((item, j) => targetBoard[j][targetBoard.length - 1 - i])
  );

  return output;
}

//add 2 or 4 into board game every time user press any arrow key
function addNum(targetBoard) {
  const row = Math.floor(Math.random() * 4);
  const column = Math.floor(Math.random() * 4);
  const selectNum = Math.floor(Math.random() * 10);

  const num = selectNum === 0 ? 4 : 2;

  if (targetBoard[row][column] === 0) {
    targetBoard[row][column] = num;
    return;
  }
  addNum(targetBoard);
}

//Move all '0' to the end of row
function sliceArr(arr) {
  const newArr = arr.filter((item) => item !== 0);

  while (newArr.length < arr.length) {
    newArr.push(0);
  }

  return newArr;
}

//Sum up if two side-by-size elements is equal
function sumUp(arr) {
  arr.forEach((item, i) => {
    if (i >= item.length) return;

    if (item === arr[i + 1]) {
      arr[i] *= 2;
      arr[i + 1] = 0;
      score = score + arr[i];
      if (arr[i] === 2048) {
        winGame();
      }
    }
  });

  return arr;
}

//handle end game
function endGame() {
  notification.classList.remove("display-none");
  notification.classList.add("game-over");
  let endGame = `
    <p class='noti'>Game over!</p>
    <button class='btn' onclick='location.reload()'>Try again</button>
    `;
  notification.innerHTML = `${endGame}`;
}

//handle win game
function winGame() {
  notification.classList.remove("display-none");
  notification.classList.add("win-game");
  let winGame = `
    <p class='noti'>
    YOU WIN!
    </p>
    <div class='btn-group'>
    <button class='btn' onclick='countinueGame()'>Keep going</button>
    <button class='btn' onclick='location.reload()'>Start new game</button>
    </div>
    `;
  notification.innerHTML = `${winGame}`;
}

function countinueGame() {
  notification.classList.remove("win-game");
  notification.classList.add("display-none");
  notification.innerHTML = "";
}

//check game over (if any move available)
function checkGameEnd(targetBoard) {
  return (
    checkMove(targetBoard) ||
    checkMove(rotateClockwise(targetBoard)) ||
    checkMove(rotateAntiClockwise(targetBoard)) ||
    checkMove(rotateAntiClockwise(rotateAntiClockwise(targetBoard)))
  );
}

//check if any move available when press left around key
function checkMove(targetBoard) {
  return targetBoard.some((_row, i) => {
    let row = _row.concat();
    row = sliceArr(row);

    return row.some((item, j) => item === row[j - 1]);
  });
}
renderGame(cells);
document.addEventListener("keydown", (e) => handleGame(e));
