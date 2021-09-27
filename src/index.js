import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  let won = props.won ? "won" : ""
  return (
    <button className={"square "+won} value={props.value} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, won) {
    return (
      <Square
        value={this.props.squares[i]}
        won={won}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = this.props.winner
    return (
      <div>
        {
          Array.from(Array(3).keys()).map((row) =>
            <div className="board-row">
              {Array.from(Array(3).keys()).map((col) => this.renderSquare(row * 3 + col, winner.includes(row * 3 + col)))}
            </div>)
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), clickIndex: null }],
      stepNumber: 0,
      xIsNext: true,
      ascend: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat({ squares: squares, clickIndex: i }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({ stepNumber: step, xIsNext: step % 2 === 0 });
  }

  toggle = () => {
    this.setState({
      ascend: !this.state.ascend,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const squares = current.squares;
    const toggle = this.state.ascend ? "Ascending" : "Descending";
    const moves = history.map((step, move) => {
      if(this.state.ascend){
        move = history.length - 1 - move;
      }
      const clickIndex = step.clickIndex
      const col = clickIndex % 3 + 1
      const row = Math.floor(clickIndex / 3 + 1)
      const decs = move ? `Go to #${move} (${col}, ${row})` : "Go to game start";
      return (
        <li key={move}>
          <button className={this.state.stepNumber === move ? "selected" : ""} onClick={() => this.jumpTo(move)}>{decs}</button>
        </li>
      );
    });
    const winner = calculateWinner(squares);
    let status = winner ? "Winner: " + squares[winner[0]] : this.state.stepNumber===9 ? "Draw" : "Next player: " + (this.state.xIsNext ? "X" : "O") ;
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winner={winner ? winner : []} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick = {this.toggle}>{toggle}</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
