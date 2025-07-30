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

router.put("/:id", async (req: AuthReq, res) => {
  console.log("Tasks PUT - User ID:", req.user?.id);
  console.log("Tasks PUT - Task ID:", req.params.id);
  console.log("Tasks PUT - Body:", req.body);
  const { id } = req.params;
  const { title, due, xpWeight, completed } = req.body;
  const prisma = getPrisma();
  
  // Verify task belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id, userId: req.user!.id }
  });
  
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  const task = await prisma.task.update({
    where: { id },
    data: { 
      title, 
      due: due ? new Date(due) : undefined, 
      xpWeight, 
      completed 
    }
  });
  console.log("Tasks PUT - Task updated:", task.id);
  res.json(task);
});

router.put("/:id/complete", async (req: AuthReq, res) => {
  console.log("Tasks PUT - User ID:", req.user?.id);
  console.log("Tasks PUT - Task ID:", req.params.id);
  const { id } = req.params;
  const prisma = getPrisma();
  
  // Verify task belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id, userId: req.user!.id }
  });
  
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  const task = await prisma.task.update({
    where: { id },
    data: { completed: true }
  });
  
  // Award XP for task completion
  await prisma.xPLog.create({
    data: { amount: task.xpWeight, reason: "task_complete", userId: task.userId }
  });
  
  // Update user's total XP
  await prisma.user.update({
    where: { id: task.userId },
    data: { xp: { increment: task.xpWeight } }
  });
  
  console.log("Tasks PUT - Task completed:", task.id);
  res.json(task);
});

router.delete("/:id", async (req: AuthReq, res) => {
  console.log("Tasks DELETE - User ID:", req.user?.id);
  console.log("Tasks DELETE - Task ID:", req.params.id);
  const { id } = req.params;
  const prisma = getPrisma();
  
  // Verify task belongs to user
  const existingTask = await prisma.task.findFirst({
    where: { id, userId: req.user!.id }
  });
  
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  await prisma.task.delete({
    where: { id }
  });
  
  console.log("Tasks DELETE - Task deleted:", id);
  res.status(204).send();
});

export default router;
