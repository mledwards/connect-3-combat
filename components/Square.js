// This component outputs the individual square on the board
function Square({ player, onClick }) {
  return (
    <div className="square">
      <div
        className={"player player-" + player}
        onClick={onClick}
      >{player}</div>
    </div>
  );
}

export default Square;