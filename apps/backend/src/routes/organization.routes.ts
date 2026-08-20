import { Router } from "express";
import { prisma } from "db/client";
import { requireAuth } from "../middleware/auth.middleware";
import type { AuthRequest } from "../middleware/auth.middleware";
import { requireOrgMembership } from "../middleware/org.middleware";

const router = Router();
router.use(requireAuth);

router.post("/org", async (req: AuthRequest, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "name is required" });

  const org = await prisma.org.create({
    data: {
      name: name,
      memberships: { create: { userId: req.userId!, role: "ADMIN" } },
    },
  });
  res.status(201).json(org);
});

router.get("/org", async (req: AuthRequest, res) => {
  const memberships = await prisma.membership.findMany({
    where: { userId: req.userId! },
    include: { org: true },
  });
  res.status(200).json(memberships.map((m) => m.org))
});
