import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth.js";
import tasksRouter from "./routes/tasks.js";
import mealsRouter from "./routes/meals.js";
import foodsRouter from "./routes/foods.js";
import xpRouter from "./routes/xp.js";
import chatRouter from "./routes/chat.js";

export const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);
app.use("/meals", mealsRouter);
app.use("/foods", foodsRouter);
app.use("/xp", xpRouter);
app.use("/chat", chatRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API listening on ${port}`));
