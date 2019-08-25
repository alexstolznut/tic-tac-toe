import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
 

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      XO: true
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    console.log(history);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    console.log(i);
    if(calculateWinner(squares) || squares[i] !== null){
      this.setState({error:true})
      return;
    }
   
    squares[i] = this.state.XO ? 'X' : 'O';
    console.log(this.state.XO);
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      XO: !this.state.XO,
      error: false
    })

  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      XO: (step%2) === 0
    })
   
  }

  rerenderMovesState(state) {
    this.setState({ rerenderMoves: state });
  }

  handleError(err) {
    this.setState({ error: err });
  }
  render() {
    const history  = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if(winner) {
      status = 'Winner' + winner
    } else {
      status = 'Next Player: ' + (this.state.XO ? 'X' : 'O')
    }
    const errorMessage = () =>
      this.state.error ? (
        <p style={{ color: "red" }}>Choose another tile, this one is taken</p>
      ) : (
        ""
      );

   const moves = history.map((step, move)=>{
     const desc = move ? 'Move ' + move : 'Go to game start';

     return (
       <li key={move}>
         <button onClick={()=>this.jumpTo(move)}>{desc}</button>
      </li>
     )
   })

    return (
      <React.Fragment>
        <div className="game">
          <div className="game-board">
            <Board
              squares = {current.squares}
              onClick={(i)=>this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>
              <ul>
                <button onClick={this.handleClick} id="-1">
                  Reset
                </button>
              </ul>
            </ol>
            <ol>{moves}</ol>
          </div>
        </div>
        <p className="error">{errorMessage(this.state.error)}</p>
      </React.Fragment>
    );
  }

}

// ========================================

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
      return squares[a];
    }
  }
  return null;
}