import process from "node:process";
import { verifyToken } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import type { Socket } from "socket.io";

// auth middleware for socket.io
export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  try {
    const { token } = socket.handshake.auth;
    if (!token) {
      console.error("Socket authentication error: No token provided");
      return next(new Error("Authentication failed: No token provided"));
    }

    const session = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!session) {
      console.error("Socket authentication error: Invalid token");
      return next(new Error("Authentication failed: Invalid token"));
    }

    return next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    return next(new Error("Unable to verify token"));
  }
};

// middleware for requiring the socket id
export const requireSocketId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const socketId = req.header("X-Socket-ID");

  if (!socketId) {
    res.status(400).json({ message: "X-Socket-ID header is required" });
    return;
  }

  req.socketId = socketId;
  return next();
};
