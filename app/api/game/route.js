import { NextResponse } from "next/server";

const MAX_PLAYERS = 3;

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
  started: false,
  names: [],
  winner: false,
  lastPlay: [, ,],
  updatedAt: Date.now(),
});

const calculateWinner = (squares) => {
  for (let row = 0; row < squares.length; row++) {
    for (let column = 0; column < squares?.[row].length; column++) {
      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row]?.[column + 1] &&
        squares?.[row]?.[column] === squares?.[row]?.[column + 2]
      ) {
        return squares?.[row]?.[column];
      }

      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row + 1]?.[column] &&
        squares?.[row]?.[column] === squares?.[row + 2]?.[column]
      ) {
        return squares?.[row]?.[column];
      }

      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row + 1]?.[column + 1] &&
        squares?.[row]?.[column] === squares?.[row + 2]?.[column + 2]
      ) {
        return squares?.[row]?.[column];
      }

      if (
        squares?.[row]?.[column] &&
        squares?.[row]?.[column] === squares?.[row - 1]?.[column + 1] &&
        squares?.[row]?.[column] === squares?.[row - 2]?.[column + 2]
      ) {
        return squares?.[row]?.[column];
      }
    }
  }

  return false;
};

const getNextPlayer = ({ currentPlayer, joinedPlayers }) => {
  const joinedNumbers = joinedPlayers
    .map((player) => player.playerNumber)
    .sort((a, b) => a - b);

  if (joinedNumbers.length === 0) {
    return currentPlayer;
  }

  const currentIndex = joinedNumbers.indexOf(currentPlayer);

  if (currentIndex === -1) {
    return joinedNumbers[0];
  }

  return joinedNumbers[(currentIndex + 1) % joinedNumbers.length];
};

const applyMove = ({ game, column, playerNumber }) => {
  if (!game.started || game.joinedPlayers.length !== MAX_PLAYERS) {
    throw new Error("Game has not started yet");
  }

  if (!Number.isInteger(column) || column < 0 || column > 6) {
    throw new Error("Invalid column");
  }

  if (!Number.isInteger(playerNumber) || playerNumber < 1 || playerNumber > MAX_PLAYERS) {
    throw new Error("Invalid player number");
  }

  if (!game.joinedPlayers.some((joinedPlayer) => joinedPlayer.playerNumber === playerNumber)) {
    throw new Error("You must join the game first");
  }

  if (game.player !== playerNumber) {
    throw new Error("Not your turn");
  }

  if (game.winner) {
    throw new Error("Game already has a winner");
  }

  const newBoard = game.board.map((row) => [...row]);

  for (let row = newBoard.length - 1; row >= 0; row--) {
    let newRow = row;

    if (newBoard[row][column] === "<->") {
      newRow = row + 1;
      newBoard.pop();
      newBoard[row][column] = null;
      newBoard.unshift(Array(7).fill(null));
    }

    if (typeof newBoard[newRow][column] !== "number") {
      newBoard[newRow][column] = playerNumber;
      const winner = calculateWinner(newBoard);

      return {
        ...game,
        board: newBoard,
        player: getNextPlayer({ currentPlayer: playerNumber, joinedPlayers: game.joinedPlayers }),
        winner,
        lastPlay: [newRow, column],
        updatedAt: Date.now(),
      };
    }
  }

  throw new Error("Column is full");
};

let gameState = createInitialGame();

export async function GET() {
  return NextResponse.json({ game: gameState });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "reset") {
      gameState = createInitialGame();
      return NextResponse.json({ game: gameState });
    }

    if (action === "move") {
      const { column, playerNumber } = body;
      gameState = applyMove({
        game: gameState,
        column,
        playerNumber,
      });
      return NextResponse.json({ game: gameState });
    }

    if (action === "join") {
      const { clientId } = body;

      if (!clientId || typeof clientId !== "string") {
        throw new Error("Missing client id");
      }

      const existingPlayer = gameState.joinedPlayers.find((player) => player.clientId === clientId);

      if (existingPlayer) {
        return NextResponse.json({ game: gameState, playerNumber: existingPlayer.playerNumber });
      }

      if (gameState.joinedPlayers.length >= MAX_PLAYERS) {
        return NextResponse.json({ message: "Game is full" }, { status: 400 });
      }

      const usedNumbers = new Set(gameState.joinedPlayers.map((player) => player.playerNumber));
      let playerNumberToAssign = null;

      for (let playerNumber = 1; playerNumber <= MAX_PLAYERS; playerNumber++) {
        if (!usedNumbers.has(playerNumber)) {
          playerNumberToAssign = playerNumber;
          break;
        }
      }

      gameState = {
        ...gameState,
        joinedPlayers: [
          ...gameState.joinedPlayers,
          {
            clientId,
            playerNumber: playerNumberToAssign,
          },
        ],
        started: gameState.joinedPlayers.length + 1 === MAX_PLAYERS,
        player: gameState.joinedPlayers.length === 0 ? playerNumberToAssign : gameState.player,
        updatedAt: Date.now(),
      };

      return NextResponse.json({ game: gameState, playerNumber: playerNumberToAssign });
    }

    return NextResponse.json({ message: "Unknown action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message || "Could not update game at this time",
      },
      { status: 400 }
    );
  }
}
