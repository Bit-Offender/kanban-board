import type { Response, NextFunction } from "express";
import { prisma } from "db/client";
import type { AuthRequest } from "./auth.middleware";

export async function requireOrgMembership(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  let rawOrgId = req.body.orgId ?? req.params.orgId ?? req.query.orgId;

  if (!rawOrgId) {
    return res.status(400).json({ message: "orgId is required" });
  }

  const orgId = String(rawOrgId);

  const membership = await prisma.membership.findUnique({
    where: { userId_orgId: { userId: req.userId!, orgId } },
  });

  if (!membership || membership.accepted === "FALSE") {
    return res
      .status(403)
      .json({ message: "You are not a member of this organization" });
  }

  next();
}
