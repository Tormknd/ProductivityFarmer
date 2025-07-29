// Extend Express Request to include user object injected by auth middleware
declare namespace Express {
  interface Request {
    user?: { id: string };
  }
}
