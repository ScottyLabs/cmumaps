import { Server, Socket } from "socket.io";
import type { WebSocketPayloads } from "../../shared/websocket-types/webSocketTypes.ts";
import { WebSocketEvents } from "../../shared/websocket-types/webSocketTypes.ts";
import type { LiveUser } from "../../shared/websocket-types/userTypes.ts";
export class WebSocketService {
  private io: Server;

  private socketMap: Map<string, Socket> = new Map();
  private socketToRoom: Map<string, string> = new Map();
  private socketToUser: Map<string, LiveUser> = new Map();

  constructor(io: Server) {
    this.io = io;
    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}`);
      this.socketMap.set(socket.id, socket);
      this.socketToUser.set(socket.id, {
        userName: socket.handshake.query.userName as string,
        color: socket.handshake.query.userColor as string,
      });

      // Join a room
      socket.on("join", async (room) => {
        await socket.join(room);
        this.socketToRoom.set(socket.id, room);
        console.log(`${socket.id} joined room: ${room}`);
        await this.syncUsers(room, socket.id, true);
      });

      // Leave a room
      socket.on("leave", async (room) => {
        // sync users before leaving because can only broadcast to a room that the socket is in
        await this.syncUsers(room, socket.id, false);
        await socket.leave(room);
        this.socketToRoom.delete(socket.id);
        console.log(`${socket.id} left room: ${room}`);
      });

      // Handle broadcasts
      socket.on("broadcast", (message) => {
        // broadcast the message to all clients in the room except the sender
        const room = this.socketToRoom.get(socket.id);
        if (room) {
          socket.to(room).emit("broadcast", message);
        } else {
          console.error(
            "Could not send broadcast to room (excluding the sender) due to invalid sender or room"
          );
        }
      });

      // Handle disconnections
      socket.on("disconnect", async () => {
        const room = this.socketToRoom.get(socket.id);
        if (room) {
          await this.syncUsers(room, socket.id, false);
        }

        this.socketMap.delete(socket.id);
        this.socketToUser.delete(socket.id);
        this.socketToRoom.delete(socket.id);
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private async syncUsers(
    room: string,
    senderId: string,
    includeSender: boolean
  ) {
    // fetch all users in the room except the sender
    const users = await this.io.in(room).fetchSockets();
    const userMap: Record<string, LiveUser> = {};
    users.forEach((user) => {
      if (includeSender || user.id !== senderId) {
        userMap[user.id] = this.socketToUser.get(user.id) as LiveUser;
      }
    });

    // broadcast the updated user list
    const payload = { users: userMap };
    this.broadcastToFloor(senderId, WebSocketEvents.SYNC_USERS, payload);
  }

  /**
   * Send an event to all clients in the room
   */
  public broadcastToFloor<E extends keyof WebSocketPayloads>(
    senderId: string,
    event: E,
    payload: WebSocketPayloads[E]
  ): void {
    const room = this.socketToRoom.get(senderId);
    if (room) {
      this.io.to(room).emit(event, payload);
    } else {
      console.error(
        "Could not broadcast to room due to invalid sender or room"
      );
    }
  }
}
