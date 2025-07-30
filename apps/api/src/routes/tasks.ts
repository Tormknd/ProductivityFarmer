import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import { getPrisma } from "../index";

const router = Router();
router.use(auth);

router.get("/", async (req: AuthReq, res) => {
  console.log("Tasks GET - User ID:", req.user?.id);
  const prisma = getPrisma();
  const tasks = await prisma.task.findMany({ where: { userId: req.user!.id } });
  console.log("Tasks GET - Found tasks:", tasks.length);
  res.json(tasks);
});

router.post("/", async (req: AuthReq, res) => {
  console.log("Tasks POST - User ID:", req.user?.id);
  console.log("Tasks POST - Body:", req.body);
  const { title, due, xpWeight } = req.body;
  const prisma = getPrisma();
  const task = await prisma.task.create({
    data: { title, due: due ? new Date(due) : undefined, xpWeight, userId: req.user!.id }
  });
  console.log("Tasks POST - Created task:", task.id);
  res.status(201).json(task);
});

router.put("/:id/complete", async (req: AuthReq, res) => {
  console.log("Tasks PUT - User ID:", req.user?.id);
  console.log("Tasks PUT - Task ID:", req.params.id);
  const { id } = req.params;
  const prisma = getPrisma();
  const task = await prisma.task.update({
    where: { id },
    data: { completed: true }
  });
  await prisma.xPLog.create({
    data: { amount: task.xpWeight, reason: "task_complete", userId: task.userId }
  });
  console.log("Tasks PUT - Task completed:", task.id);
  res.json(task);
});

export default router;
