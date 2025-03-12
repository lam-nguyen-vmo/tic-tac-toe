import { useState, useCallback } from "react";

const BACKEND_API_ENDPOINT = 'http://localhost:3001';

function App() {
  const [game, setGame] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createNewGame = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    const response = await fetch(`${BACKEND_API_ENDPOINT}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    setGame(data.data);
    setMessage("New game created!");
    setLoading(false);
  }, [username]);

  const fetchGameDetails = async (gameId) => {
    const response = await fetch(`${BACKEND_API_ENDPOINT}/games/${gameId}`);
    const data = await response.json();
    setGame(data.data);
  };

  const makeMove = async (row, col) => {
    if (!game || game.board[row][col] || game.winner) return;
    
    setLoading(true);
    const response = await fetch(`${BACKEND_API_ENDPOINT}/games/make-move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, gameId: game.id, row, col }),
    });
    const data = await response.json();
    await fetchGameDetails(game.id);
    setMessage(data.message);
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Tic Tac Toe</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: "5px", fontSize: "16px", marginBottom: "10px" }}
      />
      <button
        onClick={createNewGame}
        style={{ marginLeft: "10px", padding: "5px 10px", fontSize: "16px" }}
        disabled={!username}
      >
        Start New Game
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 60px)", gap: "5px", justifyContent: "center", marginTop: "10px" }}>
        {game?.board.map((row, i) =>
          row.map((cell, j) => (
            <button
              key={`${i}-${j}`}
              style={{ width: "60px", height: "60px", fontSize: "24px" }}
              onClick={() => makeMove(i, j)}
              disabled={!!cell || game.winner}
            >
              {cell}
            </button>
          ))
        )}
      </div>
      {game?.winner && <p style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}>Winner: {game.winner}</p>}
      {message && <p style={{ fontSize: "14px", color: "gray", marginTop: "5px" }}>{message}</p>}
    </div>
  );
}

export default App;