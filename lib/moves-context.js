import React from "react";

const MovesContext = React.createContext({});

function MovesProvider(props) {
  const [moves, setMoves] = React.useState([
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
  ]);
  const value = [moves, setMoves];
  return <MovesContext.Provider value={value} {...props} />;
}

export { MovesContext, MovesProvider };
