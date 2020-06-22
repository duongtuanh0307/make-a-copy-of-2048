const boardGame=document.querySelector('#game');
const notification=document.querySelector('#notification');
const scoreDisplay=document.querySelector('#score');
const highScoreDisplay=document.querySelector('#high-score');
let cells=[
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0]
];
let score=0;
let highScore=localStorage.getItem('highScore')||0;
/*--------------Handling Game function----------------------*/
//renderGame
function renderGame(data) {
    let renderDatas='';
for(i=0;i<data.length;i++) {
    for(j=0;j<data[i].length;j++) {
        if(data[i][j]!==0) {
            const cell=`<div class='cell cell_${data[i][j]}'><p>${data[i][j]}</p></div>`;
            renderDatas=renderDatas+cell;
        } else {
            const cell=`<div class='cell cell_${data[i][j]}'></div>`;
            renderDatas=renderDatas+cell;
        };
    };
}
boardGame.innerHTML=`${renderDatas}`; //render board
let scoreValue=`
<p>SCORE:
<span>${score}</span></p>
`;
scoreDisplay.innerHTML=scoreValue; //display score
if(highScore<score) {
    highScore=score;
    localStorage.removeItem('highScore');
    localStorage.setItem('highScore',highScore); 
} 
let highScoreValue=`
    <p>BEST:
    <span>${highScore}</span></p>
    `;
highScoreDisplay.innerHTML=highScoreValue;
return;
};
//handle behaviour when user press keyboard
function handleGame(e) {
    e.preventDefault();
    switch(e.keyCode) {
        case 37: //arrow left
            cells=handleMove(cells);
        break;
        case 38: //arrow up
            cells=rotateAntiClockwise(cells);
            cells=handleMove(cells);
            cells=rotateClockwise(cells);
        break;
        case 39: //arrow right
            cells=rotateAntiClockwise(cells);
            cells=rotateAntiClockwise(cells);
            cells=handleMove(cells);
            cells=rotateClockwise(cells);
            cells=rotateClockwise(cells);
        break;
        case 40: //arrow down
            cells=rotateClockwise(cells);
            cells=handleMove(cells);
            cells=rotateAntiClockwise(cells);
        break;
    };
    renderGame(cells);
    return;
}
// process as all cells move to the left
function handleMove(targetBoard) {
    let numList=[];
    for(j=0;j<targetBoard.length;j++) {
    let targetRow=targetBoard[j];
    targetRow=sliceArr(targetRow);
    targetRow=sumUp(targetRow);
    targetRow=sliceArr(targetRow);
    targetBoard[j]=targetRow;
    numList=[...numList,...targetRow];
    };
    if(numList.includes(0)) {
        addNum(targetBoard);
    } else {
    if(!checkGameEnd(targetBoard)) {
        endGame();
    }} 
    return targetBoard;
};
//rotate board 90 degrees clockwise
function rotateClockwise(targetBoard) {
    let output=[];
    for(i=0;i<targetBoard.length;i++) {
        newRow=[];
        for(j=0;j<targetBoard[0].length;j++) {
                newRow.push(targetBoard[targetBoard.length-1-j][i]);
        };
        output.push(newRow);
    };
return output;
    }
//rotate board 90 degrees anticlockwise 
function rotateAntiClockwise(targetBoard) {
    let output=[];
    for(i=0;i<targetBoard.length;i++) {
        newRow=[];
        for(j=0;j<targetBoard[0].length;j++) {
                newRow.push(targetBoard[j][targetBoard.length-1-i]);
        };
        output.push(newRow);
    };
return output;
}
//add 2 or 4 into board game every time user press any arrow key
function addNum(targetBoard) {
    let row=Math.floor(Math.random()*4);
    let column=Math.floor(Math.random()*4);
    let selectNum=Math.floor(Math.random()*10);
    let num;
    if(selectNum===0) {num=4} else {num=2};
    if(targetBoard[row][column]===0) {
        targetBoard[row][column]=num;
        return
    } else {addNum(targetBoard)};
}
//Move all '0' to the end of row
function sliceArr(arr) {
    newArr=[];
    for(i=0;i<arr.length;i++) {
        if(arr[i]!==0) {
           newArr.push(arr[i]);
        };
    };
    while(newArr.length<arr.length) {
        newArr.push(0);
    };
    arr=newArr;
    return arr;
}
//Sum up if two side-by-size elements is equal
function sumUp(arr) {
    for(i=0;i<arr.length-1;i++) {
        if(arr[i]===arr[i+1]) {
            arr[i]=arr[i]*2;
            arr[i+1]=0;
            score=score+arr[i];
            if(arr[i]===2048) {winGame()};
        }
    };
    return arr;
}
//handle end game 
function endGame() {
    notification.classList.remove('display-none');
    notification.classList.add('game-over');
    let endGame=`
    <p class='noti'>Game over!</p>
    <button class='btn' onclick='location.reload()'>Try again</button>
    `;
    notification.innerHTML=`${endGame}`;
}
//handle win game
function winGame() {
    notification.classList.remove('display-none');
    notification.classList.add('win-game');
    let winGame=`
    <p class='noti'>
    YOU WIN!
    </p>
    <div class='btn-group'>
    <button class='btn' onclick='countinueGame()'>Keep going</button>
    <button class='btn' onclick='location.reload()'>Start new game</button>
    </div>
    `;
    notification.innerHTML=`${winGame}`;
}
function countinueGame() {
    notification.classList.remove('win-game');
    notification.classList.add('display-none');
    notification.innerHTML='';
}
//check game over (if any move available)
function checkGameEnd(targetBoard) {
    if(checkMove(targetBoard)) {return true};
    if(checkMove(rotateClockwise(targetBoard))) {return true};
    if(checkMove(rotateAntiClockwise(targetBoard))) {return true};
    if(checkMove(rotateAntiClockwise(rotateAntiClockwise(targetBoard)))) {return true};
    return false;
} 
//check if any move available when press left around key
function checkMove(targetBoard) {
    for(i=0;i<targetBoard.length;i++) {
        let row=targetBoard[i].concat();
        row=sliceArr(row);
        for(j=1;j<row.length;j++) {
            if(row[j]===row[j-1]) {return true};
        };
}
return false;
}
renderGame(cells);
document.addEventListener('keydown',(e)=>handleGame(e));

