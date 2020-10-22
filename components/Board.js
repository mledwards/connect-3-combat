import React from "react";

// Use a context for global moves, so it can be used at any component level
import { MovesContext } from "../lib/moves-context";

// Components
import { Square } from "../components/index";

// This is where the board is created
const Board = ({ board = [], addCounter }) => {

  // const [moves, setMoves] = React.useContext(MovesContext);

  // Loop the board's row
  return (
    <div className="board">
      {board.map((row) =>
        // Loop over each cell in the row
        row.map((column, columnIndex) => (
          <Square player={column} onClick={() => addCounter({ column: columnIndex })} />
        ))
      )}
    </div>
  );
};

export default Board;
