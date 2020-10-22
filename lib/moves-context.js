import React from "react";
import { fillBoard } from "./utils"
const MovesContext = React.createContext({});


function MovesProvider(props) {
  const [moves, setMoves] = React.useState(fillBoard);
  const value = [moves, setMoves];
  return <MovesContext.Provider value={value} {...props} />;
}

export { MovesContext, MovesProvider };
