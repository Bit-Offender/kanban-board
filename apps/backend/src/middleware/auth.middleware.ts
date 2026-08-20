import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import type { Board, Issue, Membership, Section } from "../../../../packages/db/generated/prisma/client";

export interface AuthRequest extends Request {
  userId?: string;
  membership?: Membership;
  board?: Board;
  section?: Section;
  issue?: Issue & { section: Section } 
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ message: "Inavlid or expired token " });
  }

  req.userId = payload.userId;
  next();
}
