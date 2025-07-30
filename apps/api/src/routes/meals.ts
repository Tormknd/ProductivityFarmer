import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import { getPrisma } from "../index";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  const prisma = getPrisma();
  const meals = await prisma.meal.findMany({ where: { userId: req.user!.id }, include: { food: true } });
  res.json(meals);
});

router.post("/", async (req: AuthReq, res) => {
  const { foodId, quantity } = req.body;
  const prisma = getPrisma();
  const meal = await prisma.meal.create({
    data: { foodId, quantity, userId: req.user!.id }
  });
  await prisma.xPLog.create({ data: { amount: 5, reason: "meal_log", userId: req.user!.id } });
  res.status(201).json(meal);
});

export default router;
