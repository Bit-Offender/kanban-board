import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "node:crypto";

const PORT = 3002;
const server = new WebSocketServer({ port: PORT });

const ROOMS: Record<string, { userId: string; socket: WebSocket }[]> = {};

server.on("connection", (socket) => {
  let joinedRoom: string | null = null;
  let userId: string | null = null;

  function leaveRoom() {
    if (!joinedRoom) return;
    const room = ROOMS[joinedRoom];
    if (room) {
      ROOMS[joinedRoom] = room.filter((u) => u.socket !== socket);
      ROOMS[joinedRoom]?.forEach(({ socket: s }) =>
        s.send(JSON.stringify({ type: "leave", userId })),
      );
      if (ROOMS[joinedRoom]?.length === 0) delete ROOMS[joinedRoom];
    }
    joinedRoom = null;
  }

  function joinRoom(boardId: string) {
    if (!ROOMS[boardId]) ROOMS[boardId] = [];
    joinedRoom = boardId;
    userId = randomUUID();

    ROOMS[boardId].forEach(({ socket: s }) =>
      s.send(JSON.stringify({ type: "join", userId })),
    );
    ROOMS[boardId].push({ userId, socket });

    socket.send(
      JSON.stringify({
        type: "initial_state",
        users: ROOMS[boardId].filter((u) => u.userId !== userId).map((u) => u.userId),
      }),
    );
  }

  socket.on("message", (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.type === "join") joinRoom(msg.boardId);
    if (msg.type === "leave") leaveRoom();
  });

  socket.on("close", leaveRoom);
});