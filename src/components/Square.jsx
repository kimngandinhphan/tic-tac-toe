import React from 'react'

function Square({value, won, onClick}) {
    let winStyle = won ? "won" : "" 
    return (
        <button className={"square " + winStyle} value={value} onClick={onClick}>
            {value}
        </button>
    )
}

export default Square
