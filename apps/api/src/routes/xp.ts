import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth.js";
import { prisma } from "../index.js";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  const total = await prisma.xPLog.aggregate({
    _sum: { amount: true },
    where: { userId: req.user!.id }
  });
  res.json({ xp: total._sum.amount ?? 0 });
});

export default router;
