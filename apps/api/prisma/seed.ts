import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test user if it doesn't exist
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1m', // test123
      name: 'Test User',
    },
  });

  // Create sample foods
  const foods = [
    {
      name: 'Chicken Breast',
      kcal: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Brown Rice',
      kcal: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4,
      sodium: 5,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Broccoli',
      kcal: 34,
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5,
      sodium: 33,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Banana',
      kcal: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Greek Yogurt',
      kcal: 59,
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.2,
      sodium: 36,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Oatmeal',
      kcal: 68,
      protein: 2.4,
      carbs: 12,
      fat: 1.4,
      fiber: 1.7,
      sugar: 0.3,
      sodium: 49,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Salmon',
      kcal: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Sweet Potato',
      kcal: 86,
      protein: 1.6,
      carbs: 20,
      fat: 0.1,
      fiber: 3,
      sugar: 4.2,
      sodium: 55,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Spinach',
      kcal: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79,
      servingSize: '100g',
      isPublic: true,
    },
    {
      name: 'Almonds',
      kcal: 579,
      protein: 21,
      carbs: 22,
      fat: 50,
      fiber: 12.5,
      sugar: 4.8,
      sodium: 1,
      servingSize: '100g',
      isPublic: true,
    },
  ];

  for (const food of foods) {
    await prisma.food.upsert({
      where: { name: food.name },
      update: {},
      create: food,
    });
  }

  // Create nutrition goals for test user
  await prisma.nutritionGoal.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      targetKcal: 2000,
      targetProtein: 150,
      targetCarbs: 250,
      targetFat: 65,
      targetFiber: 25,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
