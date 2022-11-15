const playerFactory = (name, symbol) => {
    let score = 0;
    const getName = () => name;
    const getScore = () => score;
    const increaseScore = () => score = score + 1;
    const getSymbol = () => symbol;
    const setSymbol = (newSymbol) => symbol = newSymbol;

    return ({ getName, getSymbol, getScore, increaseScore, setSymbol })
}

gameBoard = (() => {
    let gameBoardTable = [];
    gameBoardTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    const gameBoardReset = () => {
        gameBoardTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    }
    const setMove = (x_pos, y_pos, playerObject) => {
        gameBoardTable[x_pos][y_pos] = playerObject.getSymbol();
    }
    const getBoard = () => gameBoardTable;
    const getContent = (x_pos, y_pos) => gameBoardTable[x_pos][y_pos];
    return ({ gameBoardReset, setMove, getBoard, getContent });
})();


gameLogic = (() => {
    const checkValidity = (x_pos, y_pos) => gameBoard.getContent(x_pos, y_pos) === 0;
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
        console.log(checkForTie() ? "TIE" : "Keep Going");
        console.log(checkForWin() ? "Win" : "Keep Going");
    }
    return { setMove };
}
)();

displayController = (() => {
    const playingGrid = () => {
        let playingArea = document.getElementsByClassName("container")[0];
        playingArea.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let gridItem = document.createElement("div");
                gridItem.textContent = "";
                gridItem.classList.add("gridItem");
                gridItem.addEventListener('click', (event) => getPlayerInput(i,j));
                playingArea.appendChild(gridItem);
            }
        }
    }


    const getPlayerInput=(i,j)=>{
        
    }
    playingGrid();
})();



human_player = playerFactory("Player 1", "x");
computer_player = playerFactory("Player 2", "o");

console.table(gameBoard.getBoard());