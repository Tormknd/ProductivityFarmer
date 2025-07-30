import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import { getPrisma } from "../index";

const router = Router();
router.use(auth);

router.get("/barcode/:barcode", async (req: AuthReq, res) => {
  const { barcode } = req.params;
  const prisma = getPrisma();
  const food = await prisma.food.findUnique({ where: { barcode: String(barcode) } });
  return food ? res.json(food) : res.status(404).json({ error: "Not found" });
});

router.get("/", async (req: AuthReq, res) => {
  const prisma = getPrisma();
  const foods = await prisma.food.findMany({
    where: { OR: [{ ownerId: null }, { ownerId: req.user!.id }] }
  });
  res.json(foods);
});

router.post("/", async (req: AuthReq, res) => {
  const { name, barcode, kcal, protein, carbs, fat } = req.body;
  const prisma = getPrisma();
  const food = await prisma.food.create({
    data: { name, barcode, kcal, protein, carbs, fat, ownerId: req.user!.id }
  });
  res.status(201).json(food);
});

export default router;
