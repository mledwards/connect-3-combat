"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Board } from "../components/index";
import { calculateWinner } from "../lib/utils";

import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const CONSTANTS = {
  playerCount: 4,
  winCount: 3,
};

const Game = () => {
  const { playerCount } = CONSTANTS;

  const searchParams = useSearchParams();

  const playerNumber = searchParams.get("playerNumber");

  const [game, setGame] = useState({
    board: [
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      [null, "<>", null, null, null, null, null],
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
    ],
    player: 1,
    names: [],
    winner: false,
    lastPlay: [, ,],
  });
  // Set out the board

  const { player, board } = game;

  // For performance, only try and calculate the winner if the board has changed
  const winner = useMemo(() => {
    return calculateWinner(board);
  }, [board]);

  // Run once to set up game
  useEffect(() => {
    // if (!game.names.includes(name)) {
    //   setGame({
    //     ...game,
    //     names: [...game.names, name],
    //   });
    // }
    // Set up pusher channels
    const channel = pusher.subscribe("roomId");

    // Update everyone's game when a move has been made
    channel.bind("game", function (data) {
      // TODO: Use typescript to make sure both are numbers
      // console.log("data.player", data.player);
      // console.log("playerNumber", playerNumber);
      // if (data.player !== parseInt(playerNumber, 10)) {
      setGame(data);
      // }
    });

    return () => {
      pusher.unsubscribe("roomId");
    };
    // console.log(moves);
    // updateGame();
  }, []);

  // Function to add a counter to the lowest most untaken row
  const addCounter = async ({ column }) => {
    // if (player !== parseInt(playerNumber, 10)) {
    //   return;
    // }
    // Don't add counter if winner has been revealed
    if (winner) {
      return;
    }

    // Clone board state before using
    let newBoard = [...board];

    // Start from the bottom up for efficiency, as more pieces will at the bottom #gravity
    // Only check the amount of
    for (var row = newBoard.length - 1; row >= 0; row--) {

      let newRow = row;

      if (newBoard[row][column] === "<>") {

        newRow = row + 1;

        // Remove last row
        newBoard.pop();

        // Remove the powerup
        newBoard[row][column] = null;
        
        // Add empty first row
        newBoard.unshift(Array(7).fill(null));
      }

      // Check if any row has a piece
      // If not add the current player's turn piece
      if (typeof newBoard[newRow][column] !== "number") {
        newBoard[newRow][column] = player;
        // Update local storage
        // As well as states

        const newGame = {
          player: player === playerCount ? 1 : player + 1,
          board: newBoard,
          lastPlay: [newRow, column],
          winner: calculateWinner(newBoard),
        };
        setGame(newGame);

        try {
          const response = await fetch(`/api/pusher/game`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              game: newGame,
            }),
          });

          if (response.status !== 200) {
            toast.error(
              `Could not push team to new page. Error: ${response.statusText}.`
            );
          } else {
            toast.success("Team pushed to new page.");
          }
        } catch (error) {
          toast.error(`Could not push team to new page: ${error.message}`);
        }

        // Don't check anymore if a piece has been placed
        break;
      }
    }
  };
  console.log("game", game);

  //  Render the Game
  return (
    <div className="container">
      {/* <GameProvider> */}
      <p className="turn">
        <button
          className="p-3 mb-3 bg-black text-white"
          onClick={() => setGame({})}
        >
          New game
        </button>
        <span className="text-xl mb-3 block">
          Who's turn? Player {winner ? `${winner} wins` : player}
        </span>
        <span className={"player player-" + player}></span>
      </p>
      <div className="grid grid-cols-2">
        <div>
          <Board game={game} addCounter={addCounter} />
        </div>
        {/* <div>
          <h2>Players</h2>
        </div> */}
      </div>
      {/* </GameProvider> */}
    </div>
  );
};

export default Game;
