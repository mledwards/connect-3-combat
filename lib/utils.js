const calculateWinner = (squares) => {
    // Loop each row
    for (let row = 0; row < squares.length; row++) {
      for (let column = 0; column < squares[row].length; column++) {
        // NOTE: Only need to check first 4 rows
        // Check win on row only need to check first
        if (
          column < 4 &&
          squares[row][column] &&
          squares[row][column] === squares[row][column + 1] &&
          squares[row][column] === squares[row][column + 2] &&
          squares[row][column] === squares[row][column + 3]
        ) {
          return squares[row][column]; // Return player number
        }
  
        // Check win on column
        if (
          row < 4 &&
          squares[row][column] &&
          squares[row][column] === squares[row + 1][column] &&
          squares[row][column] === squares[row + 2][column] &&
          squares[row][column] === squares[row + 3][column]
        ) {
          return squares[row][column]; // Return player number
        }
  
        // Check win on diagonal right
        if (
          row < 4 &&
          column < 4 &&
          squares[row][column] &&
          squares[row][column] === squares[row + 1][column + 1] &&
          squares[row][column] === squares[row + 2][column + 2] &&
          squares[row][column] === squares[row + 3][column + 3]
        ) {
          return squares[row][column]; // Return player number
        }
  
        // Check win on diagonal right
        if (
          row > 3 &&
          column < 4 &&
          squares[row][column] &&
          squares[row][column] === squares[row - 1][column + 1] &&
          squares[row][column] === squares[row - 2][column + 2] &&
          squares[row][column] === squares[row - 3][column + 3]
        ) {
          return squares[row][column]; // Return player number
        }
      }
    }
  };

  const fillBoard = [
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
  ];

  export { calculateWinner, fillBoard }

