import { verifyToken } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import type { Socket } from "socket.io";

// for http requests
// https://clerk.com/docs/references/express/overview#example-use-clerk-client-to-get-a-users-information
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  next();
};

// for socket.io
const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token;
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

export { checkAuth, socketAuth };
