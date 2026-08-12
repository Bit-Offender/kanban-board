import express from "express";
import { prisma } from "db/client";

const PORT = 3000;

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    await prisma.user.create({
        data: {
            username,
            password
        }
    })

    res.json({
        message: "Signed Up!"
    })
})

app.listen(PORT, () => {
    console.log(`Backend running on ${PORT}`);
})