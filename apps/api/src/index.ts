import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";
import mealsRouter from "./routes/meals";
import foodsRouter from "./routes/foods";
import xpRouter from "./routes/xp";
import chatRouter from "./routes/chat";

// Debug environment variables
console.log("Environment variables check:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Set" : "Not set");
console.log("PORT:", process.env.PORT);

// Initialize Prisma client lazily to ensure environment variables are loaded
let prisma: PrismaClient;

function getPrisma() {
  if (!prisma) {
    console.log("Initializing Prisma client...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    
    // Set DATABASE_URL if not already set
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = "file:./prisma/dev.db";
      console.log("Set DATABASE_URL to:", process.env.DATABASE_URL);
    }
    
    prisma = new PrismaClient();
  }
  return prisma;
}

export { getPrisma };

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
