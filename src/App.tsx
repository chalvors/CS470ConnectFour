import { useState } from 'react';

import './App.css';

function App() {

    let [board, setBoard]: any = useState([
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
    ]);

    // 0 for player, 1 for ai
    const [turn, setTurn]: any = useState(0)  

    const [winState, setWinState]: any = useState('')

    function displayBoard() {

        return (board.map((row: any) => {
            return (<tr>{
                
                row.map((cell: any) => {

                    let color = "white"

                    if (cell === 1) {
                        color = "green"
                    }
                    else if (cell === 2) {
                        color = "red"
                    }
                    return(<td style={{backgroundColor: color}}>{cell}</td>)
                })
            }</tr>)
        }))
    }

    function switchTurns(turn: number) {

        const playerOneElement = document.getElementById('p1');
        const playerTwoElement = document.getElementById('p2');

        if (turn === 1) {

            // switch turn and change color to player 2
            setTurn(1)
            playerOneElement?.style.setProperty("background-color", "white")
            playerTwoElement?.style.setProperty("background-color", "red")
        }
        else if (turn === 0) {

            // switch turn and change color to player 1
            setTurn(0)
            playerTwoElement?.style.setProperty("background-color", "white")
            playerOneElement?.style.setProperty("background-color", "green")
        }
    }

    function updateBoard(col: number, marker: number) {

        let tempBoard = board;

        for (let i = 5; i >= 0; i--) {

            if (board[i][col] === 0) {

                tempBoard[i][col] = marker
                break;
            }
        }

        setBoard(tempBoard)
    }

    function checkWin() {

        function checkVertical(cell: number, i: number, j: number) {

            if (i < 3) {

                const down1 = board[i+1][j];
                const down2 = board[i+2][j];
                const down3 = board[i+3][j];

                if (down1 === cell && down2 === cell && down3 === cell) {

                    return true
                }
            }

            return false
        }

        function checkHorizontal(cell: number, i: number, j: number) {

            if (j < 4) {

                const over1 = board[i][j+1];
                const over2 = board[i][j+2];
                const over3 = board[i][j+3];

                if (over1 === cell && over2 === cell && over3 === cell) {

                    return true
                }
            }

            return false
        }

        function checkDownRight(cell: number, i: number, j: number) {

            if (i < 3 && j < 4) {

                const corner1 = board[i+1][j+1];
                const corner2 = board[i+2][j+2];
                const corner3 = board[i+3][j+3];

                if (corner1 === cell && corner2 === cell && corner3 === cell) {

                    return true
                }
            }

            return false
        }

        function checkUpRight(cell: number, i: number, j: number) {

            if (i > 2 && j < 4) {

                const corner1 = board[i-1][j+1];
                const corner2 = board[i-2][j+2];
                const corner3 = board[i-3][j+3];

                if (corner1 === cell && corner2 === cell && corner3 === cell) {

                    return true
                }
            }

            return false
        }

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {

                const cell = board[i][j];
                
                if (cell !== 0) {

                    const vertical = checkVertical(cell, i, j);
                    const horizontal = checkHorizontal(cell, i, j);
                    const downRight = checkDownRight(cell, i, j);
                    const upRight = checkUpRight(cell, i, j);

                    if (vertical || horizontal || downRight || upRight) {

                        setWinState(cell);
                        return true
                    }
                }
            }
        }

        return false
    }

    function aiTurn() {

        // returns the col the ai should play in or 'random'
        function assessBoard(): any {

            function checkVertical(marker: number, i: number, j: number) {

                if (i > 2) {

                    const up1 = board[i-1][j];
                    const up2 = board[i-2][j];
                    const up3 = board[i-3][j];

                    if (up1 == marker && up2 == marker && up3 == 0) {

                        return j;
                    }
                }
                return null;
            }

            function checkHorizontal(marker: number, i: number, j: number) {

                if (j < 4) {

                    const over1 = board[i][j+1];
                    const over2 = board[i][j+2];
                    const over3 = board[i][j+3];

                    // C _ M M
                    if (over1 === 0 && over2 === marker && over3 === marker) {
                        return j+1;
                    }
                    // C M _ M
                    else if (over1 === marker && over2 === 0 && over3 === marker) {
                        return j+2;
                    }
                    // C M M _
                    else if(over1 === marker && over2 === marker && over3 === 0) {
                        return j+3;
                    }
                }
                return null;
            }

            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[0].length; j++) {
                    
                    const cell = board[i][j];

                    if (cell !== 0) {

                        const canWinVertical = checkVertical(2, i, j);
                        const canWinHorizontal = checkHorizontal(2, i, j);

                        const canBlockVertical = checkVertical(1, i, j);
                        const canBlockHorizontal = checkHorizontal(1, i, j);

                        // ai can win
                        if (canWinVertical !== null || canWinHorizontal !== null) {
                            
                            // return first one that is not null
                            if (canWinVertical !== null) {
                                return canWinVertical;
                            }
                            else if (canWinHorizontal !== null) {
                                return canWinHorizontal;
                            }
                        }
                        // ai can block
                        else if (canBlockVertical !== null || canBlockHorizontal !== null) {
            
                            // return first one that is not null
                            if (canBlockVertical !== null) {
                                return canBlockVertical;
                            }
                            else if (canBlockHorizontal !== null) {
                                return canBlockHorizontal;
                            }
                        }
                    }
                }
            }
            return 'random';
        }

        function playRandomly() {

            const availableCols: number[] = [];

            for (let i = 0; i < 7; i++) {

                let topCell = board[0][i];

                if (topCell === 0) {

                    availableCols.push(i);
                }
            }

            const random = Math.floor(Math.random() * availableCols.length);
            const col = availableCols[random];

            updateBoard(col, 2);
        }

        // wait 0.75 seconds so it's not instant
        setTimeout(() => {

            const col = assessBoard();
            
            if (col === 'random') {

                playRandomly();
            }
            else {

                updateBoard(col, 2);
            }

            if(!checkWin()) {   

                // switch back to player turn
                switchTurns(0)
            }
        }, 750);
    }

    function play(col: number) {

        if (turn === 0) {

            let topCell = board[0][col];

            if(topCell === 0) {

                updateBoard(col, 1);

                if(!checkWin()) {

                    // switch to ai's turn
                    switchTurns(1)
                    aiTurn()
                }
            }
        }
    }

    function displayWinner() {

        if (winState === 0) {
            return <p></p>
        }
        else if (winState === 1) {
            return <p>Player 1 Wins!</p>
        }
        else if (winState === 2) {
            return <p>AI Wins!</p>
        }
    }

    return (
        <div className="App">
            <div id="centerMe">
                <div id="title">
                    <div id="p1" style={{backgroundColor: "green"}}><p>Player</p></div>
                    <div id="p2"><p>AI</p></div>
                </div>
                <table id="table">
                    <thead>
                        <tr>
                            <th><button onClick={()=>{play(0)}}>play</button></th>
                            <th><button onClick={()=>{play(1)}}>play</button></th>
                            <th><button onClick={()=>{play(2)}}>play</button></th>
                            <th><button onClick={()=>{play(3)}}>play</button></th>
                            <th><button onClick={()=>{play(4)}}>play</button></th>
                            <th><button onClick={()=>{play(5)}}>play</button></th>
                            <th><button onClick={()=>{play(6)}}>play</button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayBoard()}
                    </tbody>
                </table>
                <div style={{paddingTop: "16px"}}>
                    <button onClick={()=>{window.location.reload()}}>reset</button>
                </div>
                <div>
                    {displayWinner()}
                </div>
            </div>
        </div>
    );
}

export default App;