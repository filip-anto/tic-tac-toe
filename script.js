const playerFactory = (name, symbol) => {
    let score = 0;
    const getName = () => name;
    const getScore = () => score;
    const increaseScore = () => score = score + 1;
    const getSymbol = () => symbol;
    const setSymbol = (newSymbol) => symbol = newSymbol;
    return ({ getName, getSymbol, getScore, increaseScore, setSymbol })
}

const gameBoard = (() => {
    let gameBoardTable = [];
    gameBoardTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const gameBoardReset = () => {
        gameBoardTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        displayController.playingGrid();
    }
    const setMove = (x_pos, y_pos, playerObject) => {
        gameBoardTable[x_pos][y_pos] = playerObject.getSymbol();
    }
    const getBoard = () => gameBoardTable;
    const getContent = (x_pos, y_pos) => gameBoardTable[x_pos][y_pos];
    return ({ gameBoardReset, setMove, getBoard, getContent });
})();


gameLogic = (() => {
    let gameStatus = true;
    let tie = false;
    let game_end = false;
    let rand = () => Math.ceil(3 * Math.random(0, 1)) - 1;
    const calculateComputerMove = () => {
        let flag = false;
        let x_pos;
        let y_pos;
        do {
            x_pos = rand();
            y_pos = rand();
            flag = checkValidity(x_pos, y_pos);
        } while (flag == false);
        gameBoard.setMove(x_pos, y_pos, computer_player);
        displayController.displayComputerMove(x_pos, y_pos);
    }
    const checkValidity = (x_pos, y_pos) => (gameBoard.getContent(x_pos, y_pos) === 0 ? true : false);
    const checkForTie = () => {
        let board = gameBoard.getBoard();
        for (i in board) {
            for (j in board[i]) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    const checkForWin = () => {
        let board = gameBoard.getBoard();
        if ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) && board[0][0] != 0) {
            return true;
        }
        if ((board[0][2] === board[1][1] && board[1][1] === board[2][0]) && board[2][0] != 0) {
            return true;
        }
        if ((board[0][0] === board[0][1] && board[0][1] === board[0][2]) && board[0][2] != 0) {
            return true;
        }
        if ((board[1][0] === board[1][1] && board[1][1] === board[1][2]) && board[1][2] != 0) {
            return true;
        }
        if ((board[2][0] === board[2][1] && board[2][1] === board[2][2]) && board[2][2] != 0) {
            return true;
        }
        if ((board[0][0] === board[1][0] && board[1][0] === board[2][0]) && board[2][0] != 0) {
            return true;
        }
        if ((board[0][1] === board[1][1] && board[1][1] === board[2][1]) && board[2][1] != 0) {
            return true;
        }
        if ((board[0][2] === board[1][2] && board[1][2] === board[2][2]) && board[2][2] != 0) {
            return true;
        }
    }
    const setMove = (x_pos, y_pos, playerObject) => {
        (checkValidity(x_pos, y_pos) ? gameBoard.setMove(x_pos, y_pos, playerObject) : console.log("ERROR"));
        console.table(gameBoard.getBoard());
        tie = (checkForTie() ? true : false);
        game_end = (checkForWin() ? true : false);
        console.log(tie);
        console.log(game_end);
        if (tie === false && game_end === false) {
            calculateComputerMove();
            tie = (checkForTie() ? true : false);
            game_end = (checkForWin() ? true : false);
            if (game_end === true) {
                createUI.displayWinner("AI");
                gameBoard.gameBoardReset();
            }
        } else if (game_end === true) {
            createUI.displayWinner("player");
            gameBoard.gameBoardReset();
        } else {
            createUI.displayWinner("Tie");
            gameBoard.gameBoardReset();
        }

    }
    return { setMove, checkValidity };
}
)();

displayController = (() => {
    function myFunc(event) {
        getPlayerInput(event, event.srcElement.classList[1][0], event.srcElement.classList[1][1]);
    }
    const playingGrid = () => {
        let playingArea = document.getElementsByClassName("container")[0];
        playingArea.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let gridItem = document.createElement("div");
                gridItem.classList.add("gridItem");
                gridItem.classList.add("" + i + j);
                gridItem.addEventListener('click', myFunc);
                playingArea.appendChild(gridItem);
            }
        }
    }
    const displayComputerMove = (i, j) => {
        let x = i * 3 + j + 1;
        console.log(x);
        let chosen_block = document.querySelector(".container :nth-child(" + x + ")");
        chosen_block.innerHTML = computer_player.getSymbol();
        chosen_block.removeEventListener('click', myFunc);
        chosen_block.classList.add("computerChoice");
    }
    const getPlayerInput = (event, i, j) => {
        gameLogic.setMove(i, j, human_player);
        event.srcElement.innerHTML = (human_player.getSymbol());
        event.srcElement.classList.add("playerChoice");
        event.srcElement.removeEventListener('click', myFunc);
    }
    playingGrid();
    return { displayComputerMove, playingGrid }
})();


human_player = playerFactory("Player 1", "X");
computer_player = playerFactory("Player 2", "O");

let gameMode=0;
let menu_status = 0;

createUI=(()=>{
    document.addEventListener('DOMContentLoaded', function () {
        document.getElementsByTagName("h2")[0].classList.add("loaded");
    }, false);
    
    document.getElementById("positive").addEventListener("click", start_game);
    document.getElementById("negative").addEventListener("click", start_game);
    document.getElementsByTagName("h2")[0].addEventListener("transitionend", makeButtonsVisible);
function makeButtonsVisible() {
    
    document.getElementsByClassName("options")[0].style.visibility = "visible";
}


function start_game(e) {
    if (menu_status === 0) {
        chooseGameMode();
    } else {
        createFirstPlayer();
        gameMode=1;
        if (e.srcElement.id === "negative") {
            createSecondPlayer();
            gameMode=2;
        }
        setPlayerInputArea();

    }
}
function chooseGameMode() {
    document.getElementsByTagName("h2")[0].innerHTML = "Against A Computer Or Another Player?";
    document.getElementsByTagName("button")[0].innerHTML = "Computer";
    document.getElementsByTagName("button")[1].innerHTML = "Player";
    menu_status = 1;
}

function createFirstPlayer() {
    let player1Label = document.createElement("label");
    player1Label.setAttribute("for", "player1TextField");
    player1Label.textContent = "Enter Player 1 name";
    let player1TextField = document.createElement("textArea");
    player1TextField.setAttribute("id", "player1TextField");
    document.getElementsByClassName("options")[0].appendChild(player1Label);
    document.getElementsByClassName("options")[0].appendChild(player1TextField);
}

function createSecondPlayer() {
    player2Label = document.createElement("label");
    player2Label.setAttribute("for", "player2TextField");
    player2Label.textContent = "Enter Player 2 name";
    let player2TextField = document.createElement("textArea");
    player2TextField.setAttribute("id", "player2TextField");
    document.getElementsByClassName("options")[0].appendChild(player2Label);
    document.getElementsByClassName("options")[0].appendChild(player2TextField);
}

function setPlayerInputArea() {
    document.getElementsByTagName("button")[1].remove();
    document.getElementsByTagName("button")[0].remove();
    let submitInputButton = document.createElement("button");
    submitInputButton.addEventListener('click',createPlayerUI);
    submitInputButton.textContent = "Submit";
    menu_status = 2;
    document.getElementsByClassName("options")[0].appendChild(submitInputButton);
}

function createPlayerUI(){
    if (gameMode==1){    
        document.getElementsByTagName("h2")[0].textContent=(document.getElementsByTagName("textArea")[0].value)+"  vs  A.I.";
        removePlayer1Input();
    }else{
        document.getElementsByTagName("h2")[0].textContent=(document.getElementsByTagName("textArea")[0].value)+"  vs  "+ (document.getElementsByTagName("textArea")[1].value);
        removePlayer1Input();
        removePlayer2Input();   
    }
    document.getElementsByClassName("container")[0].style.visibility = "visible";
}
function removePlayer1Input(){
    document.getElementsByTagName("button")[0].removeEventListener('click',createPlayerUI);
    document.getElementsByTagName("label")[0].remove();
    document.getElementById("player1TextField").remove();
    document.getElementsByTagName("button")[0].remove();
}

function removePlayer2Input(){
    document.getElementsByTagName("label")[0].remove();
    document.getElementById("player2TextField").remove();
}
function displayWinner($1){
    if($1=="Tie"){
        document.getElementsByTagName("h2")[0].textContent= "It is a "+$1;
    }else{
    document.getElementsByTagName("h2")[0].textContent= "Winner is "+$1;
}
}
return{displayWinner};
})();