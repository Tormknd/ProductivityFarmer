import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../index.js";

const router = Router();
const TOKEN_EXP = "7d";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { email, passwordHash: hash, name } });
    res.status(201).json({ id: user.id });
  } catch {
    res.status(400).json({ error: "Email exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid email" });
  if (!(await bcrypt.compare(password, user.passwordHash)))
    return res.status(400).json({ error: "Invalid password" });
  const token = jwt.sign({}, process.env.JWT_SECRET!, { subject: user.id, expiresIn: TOKEN_EXP });
  res.json({ token });
});

export default router;
