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
  let renderDatas = "";
  data.forEach((row, i) => {
    row.forEach((item, j) => {
      if (item !== 0) {
        const cell = `<div class='cell cell_${item}'><p>${item}</p></div>`;
        renderDatas = renderDatas + cell;
      } else {
        const cell = `<div class='cell cell_${item}'></div>`;
        renderDatas = renderDatas + cell;
      }
    });
  });

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
    case 37: //arrow left
      cells = handleMove(cells);
      break;
    case 38: //arrow up
      cells = rotateAntiClockwise(cells);
      cells = handleMove(cells);
      cells = rotateClockwise(cells);
      break;
    case 39: //arrow right
      cells = rotateAntiClockwise(cells);
      cells = rotateAntiClockwise(cells);
      cells = handleMove(cells);
      cells = rotateClockwise(cells);
      cells = rotateClockwise(cells);
      break;
    case 40: //arrow down
      cells = rotateClockwise(cells);
      cells = handleMove(cells);
      cells = rotateAntiClockwise(cells);
      break;
  }
  renderGame(cells);
  return;
}
// process as all cells move to the left
function handleMove(targetBoard) {
  let numList = [];
  targetBoard.forEach((row, j) => {
    let targetRow = row;
    targetRow = sliceArr(targetRow);
    targetRow = sumUp(targetRow);
    targetRow = sliceArr(targetRow);
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
  let output = [];
  targetBoard.forEach((row, i) => {
    newRow = [];
    row.forEach((item, j) => {
      newRow.push(targetBoard[targetBoard.length - 1 - j][i]);
    });
    output.push(newRow);
  });

  return output;
}
//rotate board 90 degrees anticlockwise
function rotateAntiClockwise(targetBoard) {
  let output = [];
  targetBoard.forEach((row, i) => {
    newRow = [];
    row.forEach((item, j) => {
      newRow.push(targetBoard[j][targetBoard.length - 1 - i]);
    });
    output.push(newRow);
  });

  return output;
}
//add 2 or 4 into board game every time user press any arrow key
function addNum(targetBoard) {
  let row = Math.floor(Math.random() * 4);
  let column = Math.floor(Math.random() * 4);
  let selectNum = Math.floor(Math.random() * 10);
  let num;
  if (selectNum === 0) {
    num = 4;
  } else {
    num = 2;
  }
  if (targetBoard[row][column] === 0) {
    targetBoard[row][column] = num;
    return;
  } else {
    addNum(targetBoard);
  }
}
//Move all '0' to the end of row
function sliceArr(arr) {
  newArr = [];
  arr.forEach((item) => {
    if (item !== 0) {
      newArr.push(item);
    }
  });
  while (newArr.length < arr.length) {
    newArr.push(0);
  }
  arr = newArr;
  return arr;
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
  if (checkMove(targetBoard)) {
    return true;
  }
  if (checkMove(rotateClockwise(targetBoard))) {
    return true;
  }
  if (checkMove(rotateAntiClockwise(targetBoard))) {
    return true;
  }
  if (checkMove(rotateAntiClockwise(rotateAntiClockwise(targetBoard)))) {
    return true;
  }
  return false;
}
//check if any move available when press left around key
function checkMove(targetBoard) {
  targetBoard.forEach((_row, i) => {
    let row = _row.concat();
    row = sliceArr(row);

    row.forEach((item, j) => {
      if (item === row[j - 1]) {
        return true;
      }
    });
  });

  return false;
}
renderGame(cells);
document.addEventListener("keydown", (e) => handleGame(e));
