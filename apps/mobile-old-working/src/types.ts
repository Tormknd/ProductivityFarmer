export interface Task {
  id: string;
  title: string;
  due?: Date;
  completed: boolean;
  xpWeight: number;
  userId: string;
  createdAt: Date;
}

export interface Food {
  id: string;
  name: string;
  barcode?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  ownerId?: string;
}

export interface Meal {
  id: string;
  userId: string;
  foodId: string;
  food: Food;
  quantity: number;
  loggedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  xp: number;
  createdAt: Date;
}

export interface XPLog {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  createdAt: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
} 