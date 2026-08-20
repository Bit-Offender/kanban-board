import express from "express";
import { prisma } from "db/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const PORT = 3000;

const app = express();

app.use(express.json());

const signUpSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
});

app.post("/signup", async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: z.treeifyError(parsed.error) });
  }
  const { username, password } = parsed.data;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return res.status(201).json({ message: "Signed Up!" });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Username already taken" });
    }
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});
