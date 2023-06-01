const calculateWinner = (squares) => {
  // Loop each row
  for (let row = 0; row < squares.length; row++) {
    for (let column = 0; column < squares?.[row].length; column++) {
      // TODO: Make this dynamic, so we can change amount of players
      // Check win on row only need to check first
      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row]?.[column + 1] &&
        squares?.[row]?.[column] === squares?.[row]?.[column + 2]
      ) {
        return squares?.[row]?.[column]; // Return player number
      }

      // Check win on column
      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row + 1]?.[column] &&
        squares?.[row]?.[column] === squares?.[row + 2]?.[column]
      ) {
        return squares?.[row]?.[column]; // Return player number
      }

      // Check win on diagonal right
      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row + 1]?.[column + 1] &&
        squares?.[row]?.[column] === squares?.[row + 2]?.[column + 2]
      ) {
        return squares?.[row]?.[column]; // Return player number
      }

      // Check win on diagonal right
      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row - 1]?.[column + 1] &&
        squares?.[row]?.[column] === squares?.[row - 2]?.[column + 2]
      ) {
        return squares?.[row]?.[column]; // Return player number
      }
    }
  }
};

// Fill an empty board
const fillBoard = () => {
  return [
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
  ];
};

export { calculateWinner, fillBoard };
