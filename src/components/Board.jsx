import React from 'react'
import Square from './Square';

function Board({ squares, winnerList, size, onClick }) {
    function renderSquare(x, y, won) {
        return (
            <Square
                value={squares[x][y]}
                won={won}
                onClick={() => onClick(x, y)}
                key={x*size.rows + y}
            />
        );
    }

    return (
        <>
            {
                Array.from(Array(size.rows).keys()).map((row, index) => 
                    <div className="board-row" key={index}>
                        {Array.from(Array(size.cols).keys()).map((col) => renderSquare(row, col, winnerList.includes(`${row}, ${col}`)))}
                    </div>
                )
            }
        </>
    )
}

export default Board
