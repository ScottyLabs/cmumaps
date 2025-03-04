import { Server, Socket } from "socket.io";

// Define the WebSocketEvent type
export type WebSocketEvent = string;

export class WebSocketService {
  private socketMap: Map<string, Socket> = new Map();
  private socketToRoom: Map<string, string> = new Map();

  constructor(io: Server) {
    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.socketMap.set(socket.id, socket);

      // Join a room
      socket.on("join", (room) => {
        socket.join(room);
        this.socketToRoom.set(socket.id, room);
        console.log(`${socket.id} joined room: ${room}`);
      });

      // Leave a room
      socket.on("leave", (room) => {
        socket.leave(room);
        this.socketToRoom.delete(socket.id);
        console.log(`${socket.id} left room: ${room}`);
      });

      // Handle disconnections
      socket.on("disconnect", () => {
        this.socketMap.delete(socket.id);
        this.socketToRoom.delete(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Send an event to all clients in the room except the sender
   */
  public broadcastToOthersInRoom(
    senderId: string,
    event: WebSocketEvent,
    data: unknown
  ): void {
    const senderSocket = this.socketMap.get(senderId);
    const room = this.socketToRoom.get(senderId);
    if (senderSocket && room) {
      senderSocket.to(room).emit(event, data);
    } else {
      console.error(
        "Could not send message to room due to invalid sender or room"
      );
    }
  }
}
