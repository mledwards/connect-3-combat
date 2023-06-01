'use client';

import React, { useEffect, useMemo, useState } from "react";
import { MovesProvider } from "../lib/moves-context";
import { Board } from "../components/index";
import { useQuery, queryCache } from "react-query";
import { calculateWinner, fillBoard } from "../lib/utils";

const Game = () => {
  // Set out the board
  // Clone fillBoard constant to avoid any mutation
  const [board, setBoard] = useState([...fillBoard()]);

  // Set which player's turn it will be next
  const [player, setPlayer] = useState(1);

  // Function to set all game states
  const setGame = ({ board = [...fillBoard()], player = 1, winner = false }) => {
    localStorage.setItem(
      "moves",
      JSON.stringify({
        player,
        board,
        winner,
      })
    );

    // Clone fillBoard constant to avoid any mutation
    setBoard(board);
    setPlayer(player);
  };

  // For performance, only try and calculate the winner if the board has changed
  const winner = useMemo(( ) => {
    return calculateWinner(board)
  }, [board]);

  // Run once to set up game
  useEffect(() => {
    const moves = localStorage.getItem("moves")
      ? JSON.parse(localStorage.getItem("moves"))
      : {};
    // console.log(moves);
    setGame(moves);
  }, []);

  // Function to add a counter to the lowest most untaken row
  const addCounter = ({ column }) => {
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
        setGame({
          player: player === 1 ? 2 : 1,
          board: newBoard,
          winner: calculateWinner(newBoard),
        });

        // Don't check anymore if a piece has been placed
        break;
      }
    }
  };

  //  Render the Game
  return (
    <div className="container">
      {/* <MovesProvider> */}
        <p className="turn">
          Who's turn? Player {winner ? `${winner} wins` : player}
          <button className="new-game" onClick={() => setGame({})}>
            New game
          </button>
          <span className={"player player-" + player}></span>
        </p>
        <Board player={player} board={board} addCounter={addCounter} />
      {/* </MovesProvider> */}
    </div>
  );
};

export default Game;
