import { Router } from "express";
import { prisma } from "db/client";
import { requireAuth } from "../middleware/auth.middleware";
import { requireOrgMembership } from "../middleware/org.middleware";

const router = Router();
router.use(requireAuth);

router.post("/board", requireOrgMembership, async (req, res) => {
  const { title, orgId } = req.body;
  const board = await prisma.board.create({
    data: { title, orgId: orgId },
  });
  res.status(201).json(board);
});

router.get("/board", async (req, res) => {
  const orgId = String(req.query.orgId);
  if (!orgId) {
    return res.status(400).json({ message: "orgId param is required" });
  }
  const boards = await prisma.board.findMany({ where: { orgId } });
  res.json(boards);
});

router.put("/board", async (req, res) => {
  const { boardId, title } = req.body;
  const board = await prisma.board.update({
    where: { id: boardId },
    data: { title },
  });
  res.json(board);
});

router.delete("/board", async (req, res) => {
  const { boardId } = req.body;
  await prisma.board.delete({ where: { id: boardId } });
  res.json({ message: "Board deleted" });
});

export default router;
