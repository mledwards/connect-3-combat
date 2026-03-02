import { createContext, useState } from "react";

const GameContext = createContext({});

function GameProvider(props) {
  const [game, setGame] = useState({
    board: [
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
    ],
    player: 1,
    winner: false,
  });

  const value = [game, setGame];

  return <GameContext.Provider value={value} {...props} />;
}

export { GameContext, GameProvider };
