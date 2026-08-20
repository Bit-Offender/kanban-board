import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { prisma } from "db/client";

const router = Router();
router.use(requireAuth)

router.get("/issues", async (req, res) => {
    const sectionId
})