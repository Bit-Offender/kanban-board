import { Routes, Route, BrowserRouter, useParams, Link } from "react-router";
import { useEffect, useState } from "react";
import "./index.css";

export function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/board/:boardId" element={<Board />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function Board() {
  const { boardId } = useParams();
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3002");

    ws.onopen = () => ws.send(JSON.stringify({ type: "join", boardId }));

    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data);
      if (data.type === "initial_state") setUsers(data.users);
      if (data.type === "join") setUsers((u) => [...u, data.userId]);
      if (data.type === "leave") setUsers((u) => u.filter((x) => x !== data.userId));
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "leave" }));
      }
      ws.close();
    };
  }, [boardId]);

  return (
    <div>
      <p>You are on board {boardId}</p>
      <p>Active users: {JSON.stringify(users)}</p>
      <Link to="/board/1">Board 1</Link> | <Link to="/board/2">Board 2</Link>
    </div>
  );
}

export default App;