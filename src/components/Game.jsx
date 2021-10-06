import React, { useState } from 'react'
import Board from './Board';

function Game() {
    let ROW = 5
    let COL = 5
    const [state, setState] = useState({
        history: [{ squares: Array(ROW)
            .fill()
            .map(() => Array(COL).fill(null)), clickIndex: Array(2).fill(null) }],
        stepNumber: 0,
        xIsNext: true,
        ascend: false,
    })
    const [winner, setWinner] = useState([])
    const [winnerList, setWinnerList] = useState([])
    const [size, setSize] = useState({ rows: ROW, cols: COL })

    // -------------------------------------------------------

    function handleClick(x, y) {
        if(winner.length !== 0) return;
        const history = state.history.slice(0, state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = JSON.parse(JSON.stringify(current.squares));

        squares[x][y] = state.xIsNext ? "X" : "O";
        let winResult = checkWinner(x, y, squares[x][y])
        if (winResult) {
            setWinner(winResult)
            setWinnerList(winResult.map((v) => `${v[0]}, ${v[1]}`))
        }
        setState(prevState => {
            return {
            ...prevState,
            history: history.concat({ squares: squares, clickIndex: [x, y] }),
            stepNumber: history.length,
            xIsNext: !state.xIsNext,
        }});
    }

    function jumpTo(step) {
        setState(prevState => {
            return { ...prevState, stepNumber: step, xIsNext: step % 2 === 0 }
        })
        if(state.history.length - 1 !== step) setWinnerList([])
        else setWinnerList(winner.map((v) => `${v[0]}, ${v[1]}`))
    }

    function onToggle() {
        setState(prevState => {
            return {
                ...prevState,
                ascend: !state.ascend,
            }
        });
    }

    function onSizeChange() {
        setSize({ rows: ROW, cols: COL })
        setState({
            history: [{ squares: Array(ROW)
                .fill()
                .map(() => Array(COL).fill(null)), clickIndex: Array(2).fill(null) }],
            stepNumber: 0,
            xIsNext: true,
            ascend: false,
        })
        setWinner([])
        setWinnerList([])
    }

    const checkWinner = (x, y, currentVal) => {
        const current = state.history[state.stepNumber];
        const squares = current.squares.slice();
        // console.log("quares", squares);
        let winCells = [];
    
        let coorX = x;
        let coorY = y;
        winCells.push([x, y]);
    
        //check on col
        let cntInCol = 1;
        coorX = x - 1;
        while (coorX >= 0 && squares[coorX][coorY] === currentVal) {
          winCells.push([coorX, coorY]);
          cntInCol++;
          coorX--;
        }
    
        coorX = x + 1;
        while (coorX < ROW && squares[coorX][coorY] === currentVal) {
          winCells.push([coorX, coorY]);
          cntInCol++;
          coorX++;
        }
        if (cntInCol >= 5) {
          return winCells;
        }
    
        //check on row
        winCells = [];
        winCells.push([x, y]);
        let cntInRow = 1;
        coorX = x;
        coorY = y - 1;
        while (coorY >= 0 && squares[coorX][coorY] === currentVal) {
          winCells.push([coorX, coorY]);
          cntInRow++;
          coorY--;
        }
    
        coorY = y + 1;
        while (coorX < COL && squares[coorX][coorY] === currentVal) {
          winCells.push([coorX, coorY]);
          cntInRow++;
          coorY++;
        }
        if (cntInRow >= 5) {
          return winCells;
        }
    
        //check main diagonal
        winCells = [];
        winCells.push([x, y]);
        let cntMainDiagonal = 1;
        coorY = y - 1;
        coorX = x - 1;
        while (coorY >= 0 && coorX >= 0 && squares[coorX][coorY] === currentVal) {
          winCells.push([coorX, coorY]);
          cntMainDiagonal++;
          coorY--;
          coorX--;
        }
    
        coorX = x + 1;
        coorY = y + 1;
        while (coorX < ROW && coorY < COL && squares[coorX][coorY] === currentVal) {
          cntMainDiagonal++;
          winCells.push([coorX, coorY]);
          coorX++;
          coorY++;
        }
        if (cntMainDiagonal >= 5) {
          return winCells;
        }
    
        //check skew diagonal
        winCells = [];
        winCells.push([x, y]);
        let cntSkewDiagonal = 1;
        coorX = x - 1;
        coorY = y + 1;
        while (coorY < COL && coorX >= 0 && squares[coorX][coorY] === currentVal) {
          cntSkewDiagonal++;
          winCells.push([coorX, coorY]);
          coorY++;
          coorX--;
        }
    
        coorX = x + 1;
        coorY = y - 1;
        while (coorX < ROW && coorY >= 0 && squares[coorX][coorY] === currentVal) {
          cntSkewDiagonal++;
          winCells.push([coorX, coorY]);
          coorX++;
          coorY--;
        }
        if (cntSkewDiagonal >= 5) {
          return winCells;
        }
    
        return false;
      };
    
    const history = state.history;
    const current = history[state.stepNumber]
    const squares = current.squares
    const toggle = state.ascend ? "Ascending" : "Descending"
    const moves = history.map((step, move) => {
        if (state.ascend) {
            move = history.length - 1 - move;
        }
        const decs = move ? `Go to #${move} (${history[move].clickIndex[0]+1}, ${history[move].clickIndex[1]+1})` : "Go to game start";
        return (
            <li key={move}>
                <button className={state.stepNumber === move ? "selected" : ""} onClick={() => jumpTo(move)}>{decs}</button>
            </li>
        );
    });
    let status = "Next player: " + (state.xIsNext ? "X" : "O")
    if(current.clickIndex[0]) {
        status = winner.length !== 0 ? "Winner: " + squares[current.clickIndex[0]][current.clickIndex[1]] : (state.stepNumber === ROW*COL) ? "Draw" : "Next player: " + (state.xIsNext ? "X" : "O")
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board squares={current.squares} winnerList={winnerList} size={size} onClick={(x, y) => handleClick(x, y)} />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={onToggle}>{toggle}</button>
                <ol>{moves}</ol>
            </div>
            <div className="game-input">
                <form action="#" method="get">
                    <label htmlFor="rows">Rows:</label>
                    <input type="number" name="" id="rows" min={5} onChange={e => {ROW = +e.target.value}} />
                    <label htmlFor="cols">Columns:</label>
                    <input type="number" name="" id="cols" min={5} onChange={e => {COL = +e.target.value}} />
                    <button type="submit" onClick={onSizeChange} >Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Game
