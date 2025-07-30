import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  await prisma.food.createMany({
    data: [
      { name: "Banana", kcal: 89, protein: 1, carbs: 23, fat: 0 },
      { name: "Chicken Breast (100 g)", kcal: 165, protein: 31, carbs: 0, fat: 4 },
      { name: "Olive Oil (1 tbsp)", kcal: 119, protein: 0, carbs: 0, fat: 14 }
    ]
  });
  console.log("Seed complete");
  process.exit(0);
}

seed().catch(console.error);
