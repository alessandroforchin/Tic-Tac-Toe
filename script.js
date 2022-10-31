'use sctrict';

const Player = (sign, name) => {
    this.sign = sign;

    const getSign = () => {
        return sign;
    };

    return { getSign };
}

const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const setField = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
    }

    const getField = (index) => {
        if (index > board.length) return;
        return board[index];
    }

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    }

    return { setField, getField, reset }
})();

const gameController = (() => {
    const player1 = Player('X');    
    const player2 = Player('O');  
    let round = 1;
    let gameFinished = false;

    const playRound = (boxIndex) => {
        gameBoard.setField(boxIndex, getCurrentSign());
        if (winner(boxIndex)) {
            displayController.setResult(getCurrentSign());
            gameFinished = true;
            return;
        }
        if (round === 9) {
            gameFinished = true;
            displayController.setResult('Draw');
            return;
        }
        round++;
        displayController.setScore(`Player ${getCurrentSign()}'s turn`);
    }

    const getCurrentSign = () => {
        return round % 2 === 1 ? player1.getSign() : player2.getSign();
    }

    const winner = (boxIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
        .filter((combination) => combination.includes(boxIndex))
        .some((possibleCombination) => 
            possibleCombination.every(
                (index) => gameBoard.getField(index) === getCurrentSign()
            )
        );
    }

    const getGameFinished = () => {
        return gameFinished;
    }

    const reset = () => {
        round = 1;
        gameFinished = false;
    }

    return { playRound, getGameFinished, reset }

})();

const displayController = (() => {
    const boxes = document.querySelectorAll('.box');
    const newGame = document.getElementById('newGame');
    const score = document.querySelector('.score-container');

    boxes.forEach((box) => {
        box.addEventListener('click', (e) => {
            if (gameController.getGameFinished() || e.target.textContent !== '') return;
            gameController.playRound(parseInt(e.target.dataset.index));
            updateGameboard();
        });
    })

    newGame.addEventListener('click', () => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        setScore("Player X's turn");
    })

    const updateGameboard = () => {
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].textContent = gameBoard.getField(i);
        }
    };

    const setResult = (winner) => {
        if (winner === 'Draw') {
            setScore("It's a draw!");
        } else {
            setScore(`Player ${winner} has won!`);
        }
    };

    const setScore = (message) => {
        score.textContent = message;
    };

    return { setResult, setScore }
})();