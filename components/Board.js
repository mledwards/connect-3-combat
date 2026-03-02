import React from "react";

// Components
import { Square } from "../components/index";

// This is where the board is created
const Board = ({ game, addCounter }) => {
  const { board = [], lastPlay = [] } = game;

  // Loop the board's row
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        // Loop over each cell in the row
        row.map((column, columnIndex) => (
          <Square
            key={`square-${rowIndex}-${columnIndex}`}
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
