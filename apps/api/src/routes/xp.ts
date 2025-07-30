import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import { getPrisma } from "../index";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  const prisma = getPrisma();
  const total = await prisma.xPLog.aggregate({
    where: { userId: req.user!.id },
    _sum: { amount: true }
  });
  res.json({ xp: total._sum.amount ?? 0 });
});

export default router;
