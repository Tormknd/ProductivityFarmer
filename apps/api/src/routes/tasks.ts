import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth.js";
import { prisma } from "../index.js";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  const tasks = await prisma.task.findMany({ where: { userId: req.user!.id } });
  res.json(tasks);
});

router.post("/", async (req: AuthReq, res) => {
  const { title, due, xpWeight } = req.body;
  const task = await prisma.task.create({
    data: { title, due: due ? new Date(due) : undefined, xpWeight, userId: req.user!.id }
  });
  res.status(201).json(task);
});

router.put("/:id/complete", async (req: AuthReq, res) => {
  const { id } = req.params;
  const task = await prisma.task.update({
    where: { id },
    data: { completed: true }
  });
  await prisma.xPLog.create({
    data: { amount: task.xpWeight, reason: "task_complete", userId: task.userId }
  });
  res.json(task);
});

export default router;
