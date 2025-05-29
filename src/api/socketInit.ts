// src/api/socketInit.ts
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:4000", {
  withCredentials: true,
  autoConnect: true,
});

export default socket;
