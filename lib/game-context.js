import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

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

  useEffect(() => {
    const channel = pusher.subscribe("roomId");

    console.log("set up");

    // This bind is called when the "url" channel is triggered
    channel.bind("game", function (data) {
      console.log("data.board", data.board);
      setMoves(data.board);
    });

    return () => {
      pusher.unsubscribe("roomId");
    };
  }, []);

  return <GameContext.Provider value={value} {...props} />;
}

export { GameContext, GameProvider };
