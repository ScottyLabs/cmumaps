import { verifyToken } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";

// for http requests
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

// for socket.io
const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      console.error("Socket authentication error: No token provided");
      return;
    }

    const session = await verifyToken(token, {});

    if (!session) {
      console.error("Socket authentication error: Invalid token");
      return;
    }

    return next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    return;
  }
};

export { checkAuth, socketAuth };
