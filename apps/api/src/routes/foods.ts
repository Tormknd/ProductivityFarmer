import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth.js";
import { prisma } from "../index.js";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  const { barcode } = req.query;
  if (barcode) {
    const food = await prisma.food.findUnique({ where: { barcode: String(barcode) } });
    return food ? res.json(food) : res.status(404).json({ error: "Not found" });
  }
  const foods = await prisma.food.findMany({
    where: { OR: [{ ownerId: null }, { ownerId: req.user!.id }] },
    take: 50
  });
  res.json(foods);
});

router.post("/", async (req: AuthReq, res) => {
  const { name, barcode, kcal, protein, carbs, fat } = req.body;
  const food = await prisma.food.create({
    data: { name, barcode, kcal, protein, carbs, fat, ownerId: req.user!.id }
  });
  res.status(201).json(food);
});

export default router;
