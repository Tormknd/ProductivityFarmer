import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthReq extends Request {
  user?: { id: string };
}

export default function auth(req: AuthReq, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    req.user = { id: payload.sub };
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
