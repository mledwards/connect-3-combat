"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Board } from "../components/index";
import { calculateWinner } from "../lib/utils";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const CONSTANTS = {
  playerCount: 3,
};

const createInitialGame = () => ({
  board: [
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    [null, "<->", null, null, null, null, null],
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
  ],
  player: 1,
  joinedPlayers: [],
  names: [],
  winner: false,
  lastPlay: [, ,],
  updatedAt: 0,
});

const parsePlayerNumber = (value) => {
  const parsed = Number.parseInt(value, 10);

  if (Number.isInteger(parsed) && parsed >= 1 && parsed <= CONSTANTS.playerCount) {
    return parsed;
  }

  return null;
};

const Game = () => {
  const { playerCount } = CONSTANTS;
  const searchParams = useSearchParams();
  const urlPlayerNumber = parsePlayerNumber(searchParams.get("playerNumber"));

  const [game, setGame] = useState(createInitialGame());
  const [selectedPlayer, setSelectedPlayer] = useState(urlPlayerNumber);
  const [clientId, setClientId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { player, board } = game;
  const hasStarted = !!game.started && (game.joinedPlayers?.length || 0) === playerCount;

  const winner = useMemo(() => {
    return calculateWinner(board);
  }, [board]);

  useEffect(() => {
    const existingClientId = window.localStorage.getItem("clientId");

    if (existingClientId) {
      setClientId(existingClientId);
      return;
    }

    const newClientId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    window.localStorage.setItem("clientId", newClientId);
    setClientId(newClientId);
  }, []);

  useEffect(() => {
    const storedPlayer = parsePlayerNumber(window.localStorage.getItem("playerNumber"));

    if (urlPlayerNumber) {
      setSelectedPlayer(urlPlayerNumber);
      window.localStorage.setItem("playerNumber", String(urlPlayerNumber));
      return;
    }

    if (storedPlayer) {
      setSelectedPlayer(storedPlayer);
    }
  }, [urlPlayerNumber]);

  useEffect(() => {
    let isMounted = true;

    const fetchGame = async () => {
      try {
        const response = await fetch("/api/game", { cache: "no-store" });

        if (!response.ok) {
          throw new Error(response.statusText || "Could not fetch game state");
        }

        const data = await response.json();

        if (isMounted && data?.game) {
          setGame(data.game);
          if (
            selectedPlayer &&
            !data.game.joinedPlayers?.some(
              (joinedPlayer) => joinedPlayer.playerNumber === selectedPlayer
            )
          ) {
            setSelectedPlayer(null);
            window.localStorage.removeItem("playerNumber");
          }
        }
      } catch {
        // Ignore polling failures and try again on the next interval.
      }
    };

    fetchGame();

    const intervalId = setInterval(fetchGame, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [selectedPlayer]);

  const addCounter = async ({ column }) => {
    if (!hasStarted) {
      toast.error("Waiting for 3 players to join before starting.");
      return;
    }

    if (!selectedPlayer) {
      toast.error("Select your player number first.");
      return;
    }

    if (player !== selectedPlayer) {
      return;
    }

    if (winner) {
      return;
    }

    try {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "move",
          column,
          playerNumber: selectedPlayer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || response.statusText);
      }

      if (data?.game) {
        setGame(data.game);
      }
    } catch (error) {
      toast.error(`Could not submit move: ${error.message}`);
    }
  };

  const resetGame = async () => {
    try {
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || response.statusText);
      }

      if (data?.game) {
        setGame(data.game);
      }
    } catch (error) {
      toast.error(`Could not reset game: ${error.message}`);
    }
  };

  const joinGame = async () => {
    if (!clientId) {
      return;
    }

    try {
      setIsJoining(true);
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "join",
          clientId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || response.statusText);
      }

      if (data?.game) {
        setGame(data.game);
      }

      if (data?.playerNumber) {
        setSelectedPlayer(data.playerNumber);
        window.localStorage.setItem("playerNumber", String(data.playerNumber));
      }
    } catch (error) {
      toast.error(`Could not join game: ${error.message}`);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="container">
      <p className="turn">
        <button className="p-3 mb-3 bg-black text-white" onClick={resetGame}>
          New game
        </button>
        <span className="text-xl mb-3 block">
          {winner
            ? `Player ${winner} wins`
            : hasStarted
            ? `Who's turn? Player ${player}`
            : "Waiting for 3 players to join"}
        </span>
        <span className="text-sm mb-3 block">
          You are: {selectedPlayer ? `Player ${selectedPlayer}` : "Not selected"}
        </span>
        <span className="text-sm mb-3 block">
          Players joined: {game.joinedPlayers?.length || 0}/{playerCount}
        </span>
        <button
          className="px-3 py-2 border mb-3 bg-white text-black disabled:opacity-50"
          onClick={joinGame}
          disabled={isJoining || !!selectedPlayer || (game.joinedPlayers?.length || 0) >= playerCount}
        >
          {selectedPlayer ? `Joined as ${selectedPlayer}` : isJoining ? "Joining..." : "Join"}
        </button>
        <span className={"player player-" + player}></span>
      </p>
      <div className="grid grid-cols-2">
        <div>
          <Board game={game} addCounter={addCounter} />
        </div>
      </div>
    </div>
  );
};

export default Game;
