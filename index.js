import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Game
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: [
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null)
      ],
      player: 1
    }
  }

  addCounter(column) {
    if (this.state.winner) { return; }
    let squares = this.state.squares.slice();
    let player = this.state.player;
    // Start from the bottom up
    for (var i = squares.length - 1; i >= 0; i--) {
      if (!squares[i][column]) {
        squares[i][column] = player;;
        this.setState({
          squares: squares,
          player: player === 1 ? 2 : 1,
          winner: calculateWinner(squares)
        });
        break;
      }
    }
    
  }

  newGame() {
    this.setState({
      squares: [
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null),
        Array(7).fill(null)
      ],
      player: 1,
      winner: false
    });
  }

  render() {
    const squares = this.state.squares;


    return (
      <div>
        <p className="turn">
          Who's turn? Player {this.state.winner ? `${this.state.winner} wins` : this.state.player}
          <button className="new-game" onClick={() => this.newGame()}>New game</button>
          <span className={'player player-' + this.state.player}></span>
        </p>
        <Board player={this.state.player} squares={squares} onClick={i => this.addCounter(i)} />
      </div>
    );
  }
}

// Board
class Board extends React.Component {
  renderSquare(row, column) { 
    return (
      <Square player={this.props.squares[row][column]} onClick={() => this.props.onClick(column)} />
    );
  }

  render(props) {
    let i = 0;
    return(
      <div className="board">
        {this.renderSquare(0, 0)}
        {this.renderSquare(0, 1)}
        {this.renderSquare(0, 2)}
        {this.renderSquare(0, 3)}
        {this.renderSquare(0, 4)}
        {this.renderSquare(0, 5)}
        {this.renderSquare(0, 6)}

        {this.renderSquare(1, 0)}
        {this.renderSquare(1, 1)}
        {this.renderSquare(1, 2)}
        {this.renderSquare(1, 3)}
        {this.renderSquare(1, 4)}
        {this.renderSquare(1, 5)}
        {this.renderSquare(1, 6)}

        {this.renderSquare(2, 0)}
        {this.renderSquare(2, 1)}
        {this.renderSquare(2, 2)}
        {this.renderSquare(2, 3)}
        {this.renderSquare(2, 4)}
        {this.renderSquare(2, 5)}
        {this.renderSquare(2, 6)}

        {this.renderSquare(3, 0)}
        {this.renderSquare(3, 1)}
        {this.renderSquare(3, 2)}
        {this.renderSquare(3, 3)}
        {this.renderSquare(3, 4)}
        {this.renderSquare(3, 5)}
        {this.renderSquare(3, 6)}

        {this.renderSquare(4, 0)}
        {this.renderSquare(4, 1)}
        {this.renderSquare(4, 2)}
        {this.renderSquare(4, 3)}
        {this.renderSquare(4, 4)}
        {this.renderSquare(4, 5)}
        {this.renderSquare(4, 6)}

        {this.renderSquare(5, 0)}
        {this.renderSquare(5, 1)}
        {this.renderSquare(5, 2)}
        {this.renderSquare(5, 3)}
        {this.renderSquare(5, 4)}
        {this.renderSquare(5, 5)}
        {this.renderSquare(5, 6)}

        {this.renderSquare(6, 0)}
        {this.renderSquare(6, 1)}
        {this.renderSquare(6, 2)}
        {this.renderSquare(6, 3)}
        {this.renderSquare(6, 4)}
        {this.renderSquare(6, 5)}
        {this.renderSquare(6, 6)}
      </div>
      
    );
  }
}

function Square(props) {
  return (
    <div className="square">
      <div className={'player player-' + props.player} onClick={props.onClick}>
        
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// Utilities

function calculateWinner(squares) {
  // Loop each row
  for (var i = 0; i < squares.length; i++) {
    
    for (var j = 0; j < squares[i].length; j++) {

      // NOTE: Only need to check first 4 rows
      // Check win on row only need to check first 
      if (j < 4 && squares[i][j] && squares[i][j] === squares[i][j+1] && squares[i][j] === squares[i][j+2] && squares[i][j] === squares[i][j+3]) {
        return squares[i][j]; // Return player number
      }

      // Check win on column
      if (i < 4 && squares[i][j] && squares[i][j] === squares[i+1][j] && squares[i][j] === squares[i+2][j] && squares[i][j] === squares[i+3][j]) {
        return squares[i][j]; // Return player number
      }

      // Check win on diagonal right
      if (i < 4 && j < 4 && squares[i][j] && squares[i][j] === squares[i+1][j+1] && squares[i][j] === squares[i+2][j+2] && squares[i][j] === squares[i+3][j+3]) {
        return squares[i][j]; // Return player number
      }

      // Check win on diagonal right
      if (i > 3 && j < 4 && squares[i][j] && squares[i][j] === squares[i-1][j+1] && squares[i][j] === squares[i-2][j+2] && squares[i][j] === squares[i-3][j+3]) {
        return squares[i][j]; // Return player number
      }

    }
  }
}