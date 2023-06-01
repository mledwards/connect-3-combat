"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { GameProvider, GameContext } from "../lib/game-context";
import { Board } from "../components/index";
import { useQuery, queryCache } from "react-query";
import { calculateWinner, fillBoard } from "../lib/utils";

import Pusher from "pusher-js";

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const CONSTANTS = {
  playerCount: 3,
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
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
    ],
    player: 1,
    winner: false,
  });
  // Set out the board

  const { player, board } = game;

  console.log("board", board);

  // Function to set all game states
  // const updateGame = ({
  //   board = [...fillBoard()],
  //   player = 1,
  //   winner = false,
  // }) => {
  //   localStorage.setItem(
  //     "moves",
  //     JSON.stringify({
  //       player,
  //       board,
  //       winner,
  //     })
  //   );

  //   // Clone fillBoard constant to avoid any mutation
  //   setBoard(board);
  //   setPlayer(player);
  // };

  // For performance, only try and calculate the winner if the board has changed
  const winner = useMemo(() => {
    return calculateWinner(board);
  }, [board]);

  // Run once to set up game
  useEffect(() => {
    const moves = localStorage.getItem("moves")
      ? JSON.parse(localStorage.getItem("moves"))
      : {};

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
    // Don't add counter if winner has been revealed
    if (winner) {
      return;
    }

    // Clone board state before using
    let newBoard = [...board];

    // Start from the bottom up for efficiency, as more pieces will at the bottom #gravity
    // Only check the amount of
    for (var row = newBoard.length - 1; row >= 0; row--) {
      // Check if any row has a piece
      // If not add the current player's turn piece
      if (!newBoard[row][column]) {
        newBoard[row][column] = player;
        // Update local storage
        // As well as states
        console.log("player", player);

        const newGame = {
          player: player === playerCount ? 1 : player + 1,
          board: newBoard,
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

  //  Render the Game
  return (
    <div className="container">
      {/* <GameProvider> */}
      <p className="turn">
        Who's turn? Player {winner ? `${winner} wins` : player}
        <button className="new-game" onClick={() => setGame({})}>
          New game
        </button>
        <span className={"player player-" + player}></span>
      </p>
      <Board player={player} board={board} addCounter={addCounter} />
      {/* </GameProvider> */}
    </div>
  );
};

export default Game;
