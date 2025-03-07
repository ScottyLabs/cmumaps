import type { Request, Response, NextFunction } from "express";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};

export { requireAuth };
