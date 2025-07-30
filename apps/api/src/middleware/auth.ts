import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthReq extends Request {
  user?: { id: string };
}

export default function auth(req: AuthReq, res: Response, next: NextFunction) {
  console.log("Auth middleware - Headers:", req.headers);
  console.log("Auth middleware - Authorization:", req.headers.authorization);
  
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Auth middleware - Extracted token:", token ? "Token exists" : "No token");
  
  if (!token) {
    console.log("Auth middleware - No token found");
    return res.status(401).json({ error: "No token" });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string };
    console.log("Auth middleware - Token verified, user ID:", payload.sub);
    req.user = { id: payload.sub };
    next();
  } catch (error) {
    console.log("Auth middleware - Token verification failed:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}
