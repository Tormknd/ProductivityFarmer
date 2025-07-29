import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth.js";
import { prisma } from "../index.js";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  const meals = await prisma.meal.findMany({ where: { userId: req.user!.id }, include: { food: true } });
  res.json(meals);
});

router.post("/", async (req: AuthReq, res) => {
  const { foodId, quantity } = req.body;
  const meal = await prisma.meal.create({
    data: { foodId, quantity, userId: req.user!.id }
  });
  // XP for logging meal
  await prisma.xPLog.create({ data: { amount: 5, reason: "meal_log", userId: req.user!.id } });
  res.status(201).json(meal);
});

export default router;
