import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth, { AuthReq } from "../middleware/auth";
import { getPrisma } from "../index";

const router = Router();
const TOKEN_EXP = "7d";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const prisma = getPrisma();
    const user = await prisma.user.create({ data: { email, passwordHash: hash, name } });
    res.status(201).json({ id: user.id });
  } catch {
    res.status(400).json({ error: "Email exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid email" });
  if (!(await bcrypt.compare(password, user.passwordHash)))
    return res.status(400).json({ error: "Invalid password" });
  const token = jwt.sign({}, process.env.JWT_SECRET!, { subject: user.id, expiresIn: TOKEN_EXP });
  res.json({ token });
});

router.get("/me", auth, async (req: AuthReq, res) => {
  const prisma = getPrisma();
  const user = await prisma.user.findUnique({ 
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      xp: true,
      createdAt: true
    }
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export default router;
