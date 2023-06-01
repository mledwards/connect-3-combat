import React from "react";

// Use a context for global moves, so it can be used at any component level
import { GameContext } from "../lib/game-context";

// Components
import { Square } from "../components/index";

// This is where the board is created
const Board = ({ game, addCounter }) => {
  const { board = [], player, lastPlay = [] } = game;
  // const [moves, setMoves] = React.useContext(MovesContext);

  // Loop the board's row
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        // Loop over each cell in the row
        row.map((column, columnIndex) => (
          <Square
            lastPlay={lastPlay}
            player={column}
            row={rowIndex}
            column={columnIndex}
            onClick={() => addCounter({ column: columnIndex })}
          />
        ))
      )}
    </div>
  );
};

export default Board;
