// This component outputs the individual square on the board
function Square({ row, column, lastPlay, player, onClick }) {
  console.log("lastPlay", lastPlay);

  console.log("row", row);
  console.log("column", column);

  const lastPlayed = lastPlay?.[1] === column && lastPlay?.[0] === row;
  return (
    <div className="square">
      <div
        className={`${lastPlayed ? "border-4" : ""} player player-${player}`}
        onClick={onClick}
      >
        {player}
      </div>
    </div>
  );
}

export default Square;
