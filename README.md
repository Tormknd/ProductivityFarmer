
# ProductivityLeveling

A comprehensive productivity application with a pnpm monorepo structure featuring an Express.js backend and Expo React Native frontend, now with AI-powered chat assistance and complete nutrition tracking!

## 🚀 Current Status

### ✅ Successfully Implemented

#### Backend API (Express.js + Prisma + SQLite)
- **Authentication System**: JWT-based auth with registration/login endpoints
- **Task Management**: Complete CRUD operations with user ownership
  - `GET /tasks` - Fetch user's tasks
  - `POST /tasks` - Create new task
  - `PUT /tasks/:id` - Update task details
  - `PUT /tasks/:id/complete` - Complete task and award XP
  - `DELETE /tasks/:id` - Delete task
- **XP System**: Automatic XP rewards for task completion
- **User Management**: User profile with XP tracking
- **AI Chat Integration**: OpenAI-powered productivity assistant with nutrition context
  - `POST /chat` - Send message and get AI response with nutrition context support
  - `GET /chat/history` - Fetch conversation history
  - `DELETE /chat/history` - Clear conversation history
  - Context-aware conversations (last 20 messages)
  - Cost-optimized using GPT-4o-mini
  - **AI Tools System**: Nutrition helper with 30-day data context
  - **Structured AI Suggestions**: Meal and food suggestions with accept functionality
  - **Multiple Suggestions Support**: AI can provide multiple food/meal suggestions in one response
  - **Retry Mechanism**: Automatic retry with exponential backoff for API failures
  - **Debug Logging**: Comprehensive logging for AI responses and suggestion parsing
- **Nutrition Tracking System**: Complete MyFitnessPal-like functionality
  - `GET /nutrition/summary/:date` - Daily nutrition summary with goals
  - `GET /nutrition/monthly-data` - 30-day aggregated data for AI context
  - `POST /nutrition/meals` - Add meals to nutrition journal
  - `DELETE /nutrition/meals/:id` - Remove meals from journal
  - `GET /nutrition/foods/search` - Search public and user foods
  - `POST /nutrition/foods` - Add custom foods
  - `GET /nutrition/goals` - Get user nutrition goals
  - `PUT /nutrition/goals` - Update nutrition goals
- **Database**: SQLite with Prisma ORM, comprehensive schema including:
  - User, Task, ChatMessage models
  - Food, Meal, NutritionGoal models for nutrition tracking
  - Proper relationships and data integrity

#### Mobile App (Expo React Native)
- **Authentication**: Login/Register screens with JWT token persistence
- **Dashboard**: Complete overview with:
  - User XP and level display with progress bar
  - Task statistics (completed, pending, total)
  - Recent tasks list
  - **Nutrition Goals Summary**: Display current calorie and macro targets
  - **Profile Goals Management**: Edit nutrition goals directly from dashboard
  - Real-time data from API
- **Task Management**: Full CRUD functionality
  - View all tasks with completion status
  - Add new tasks with XP weight
  - Complete tasks (awards XP automatically)
  - Delete tasks with confirmation
- **AI Chat Assistant**: Advanced chat interface with tools and suggestions
  - Real-time messaging with AI assistant
  - Conversation history persistence
  - Clear chat history functionality
  - Loading states and error handling
  - Keyboard-aware layout with proper spacing
  - Modern chat bubble design with shadows
  - **AI Tools Modal**: Toggle nutrition context for personalized advice
  - **Nutrition Suggestions**: AI-generated meal/food suggestions with accept buttons
  - **Multiple Suggestions UI**: Grouped display of multiple AI suggestions with individual accept buttons
  - **Suggestion State Management**: Suggestions disappear after acceptance, group collapses when empty
  - **Retry Feedback**: Visual feedback for network retries
  - **Structured Suggestions**: Organized display of AI meal/food recommendations
- **Nutrition Journal**: Complete nutrition tracking interface
  - Daily nutrition summary with progress bars
  - Calorie and macro tracking (protein, carbs, fat, fiber)
  - **Clean Number Display**: Formatted nutrition values without unnecessary decimals
  - Meal organization by type (breakfast, lunch, dinner, snack)
  - Add/delete meals functionality
  - Food search and custom food creation
  - **Nutrition Goals Management**: Set and edit calorie/macro targets
  - **AI Integration**: Accept AI-suggested meals directly to journal
- **Navigation**: Tab-based navigation with Expo Router v3
- **State Management**: React Query v5 for API data fetching with retry configuration
- **UI/UX**: Modern dark theme with consistent styling and improved UX
- **Shared Utilities**: Centralized nutrition formatting functions for consistency

#### Technical Implementation
- **API Client**: Axios with automatic token injection and error handling
- **Data Fetching**: React Query hooks for tasks, user data, chat, and nutrition
- **Authentication Context**: JWT token management with SecureStore
- **XP Calculation**: Level system based on square root formula
- **Error Handling**: Comprehensive error states and user feedback
- **Debug Tools**: Extensive logging for development and troubleshooting
- **Chat System**: Context-aware conversation management with efficient token usage
- **Nutrition System**: Complete food/meal tracking with AI integration
- **AI Suggestion Parsing**: Regex-based extraction of structured meal/food data
- **Multiple Suggestions Handling**: Backend parsing and frontend grouping of multiple AI suggestions
- **Suggestion State Management**: Individual and group-level state for suggestion acceptance
- **Nutrition Formatting**: Shared utility functions for consistent number display across components
- **Retry Mechanisms**: Both backend (OpenAI calls) and frontend (React Query) retry logic

### 🔧 How It Works

1. **Authentication Flow**:
   - User registers/logs in via mobile app
   - JWT token stored in Expo SecureStore
   - Token automatically included in all API requests

2. **Task Management Flow**:
   - Tasks are created with XP weight
   - Completing a task automatically awards XP
   - XP updates trigger level recalculation
   - Dashboard shows real-time progress

3. **AI Chat Flow**:
   - User sends message through chat interface
   - Optional nutrition context toggle for personalized advice
   - Message saved to database with user association
   - AI processes message with conversation context (last 20 messages)
   - If nutrition context enabled, AI receives 30-day nutrition summary
   - AI response generated using GPT-4o-mini for cost efficiency
   - **Multiple Suggestions**: AI can provide multiple structured meal/food suggestions in one response
   - Structured meal/food suggestions parsed and extracted using regex
   - Response saved to database and displayed in real-time
   - **Grouped Suggestions**: Multiple suggestions displayed in organized groups
   - **Individual Acceptance**: Each suggestion has its own accept button
   - **State Management**: Suggestions disappear after acceptance, groups collapse when empty

4. **Nutrition Tracking Flow**:
   - Users set nutrition goals (calories, macros)
   - Log meals by searching foods or adding custom foods
   - Daily summaries show progress toward goals with **clean number formatting**
   - AI can suggest meals based on user's nutrition data
   - Accepting AI suggestions automatically adds to nutrition journal
   - **Formatted Display**: All nutrition values displayed without unnecessary decimals

5. **Data Flow**:
   - React Query manages API state and caching
   - Automatic refetching on mutations
   - Optimistic updates for better UX
   - Chat history persists across app sessions
   - Nutrition data provides context for AI assistance
   - **Shared Utilities**: Consistent formatting across all nutrition displays

### 📱 Current Features

- **Dashboard**: Welcome message, XP display, task statistics, recent tasks, nutrition goals summary
- **Tasks Tab**: Full task management interface
- **Chat Tab**: AI-powered productivity assistant with tools, nutrition context, and meal suggestions
  - **Multiple Suggestions Support**: Handle multiple AI suggestions efficiently
  - **Suggestion Management**: Accept individual suggestions, groups collapse when empty
- **Nutrition Tab**: Complete nutrition journal with meal tracking, goals management, and AI integration
  - **Clean Number Display**: Formatted nutrition values throughout the interface
- **Settings Tab**: Basic settings interface

### 🚧 What's Missing

#### High Priority
- **Task Creation UI**: Add task form in mobile app
- **Task Editing**: Edit task details (title, due date, XP weight)
- **Due Date Handling**: Task scheduling and reminders
- **Task Categories**: Organize tasks by type/project

#### Medium Priority
- **Barcode Scanning**: Scan food barcodes for quick nutrition logging
- **Notifications**: Push notifications for task reminders and nutrition goals
- **Data Export**: Export task history, nutrition data, and progress
- **Chat Enhancements**: Voice input, file sharing, task creation from chat
- **Nutrition Analytics**: Weekly/monthly nutrition insights and trends
- **Bulk Acceptance**: Accept all suggestions in a group at once

#### Low Priority
- **Social Features**: Share progress with friends
- **Achievements**: Badges and milestones
- **Advanced Analytics**: Detailed productivity insights
- **Offline Support**: Work without internet connection
- **Recipe Management**: Save and share favorite meals

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js 4
- **Database**: SQLite (dev) + Prisma ORM
- **Authentication**: JWT
- **AI Integration**: OpenAI SDK with GPT-4o-mini for chat features
- **Nutrition Tracking**: Comprehensive food/meal management system

### Frontend
- **Framework**: Expo SDK 50 + React Native 0.74
- **Navigation**: Expo Router v3 (file-based routing)
- **State Management**: React Query v5 with retry configuration
- **Storage**: Expo SecureStore (JWT tokens)
- **HTTP Client**: Axios
- **UI Components**: Custom MMORPG-themed components
- **Shared Utilities**: Centralized nutrition formatting functions

### Development
- **Package Manager**: pnpm
- **Monorepo**: pnpm workspaces
- **Language**: TypeScript
- **Environment**: Cross-env for environment variables

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Expo CLI
- SQLite (for development)
- OpenAI API key (for chat features)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ProductivityLeveling

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
cd apps/api
npx prisma generate
npx prisma db push
npx prisma db seed

# Start the backend
pnpm dev

# Start the mobile app (in another terminal)
cd apps/mobile
pnpm start
```

### Environment Variables
Create a `.env` file in the `apps/api` directory:
```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="your-secret-key"

# OpenAI (for chat features)
OPENAI_API_KEY="your-openai-api-key"
```

## 📁 Project Structure

```
ProductivityLeveling/
├── apps/
│   ├── api/                 # Express.js backend
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints (auth, tasks, chat, nutrition)
│   │   │   ├── middleware/  # Auth middleware
│   │   │   └── lib/         # Utilities (OpenAI integration)
│   │   └── prisma/          # Database schema (User, Task, ChatMessage, Food, Meal, NutritionGoal)
│   └── mobile/              # Expo React Native app
│       ├── app/             # Expo Router pages (tabs, auth)
│       └── src/
│           ├── api/         # API client and hooks (tasks, chat, nutrition)
│           ├── components/  # Reusable components (ChatBubble, NutritionJournal, NutritionSuggestion, etc.)
│           ├── lib/         # Shared utilities (nutrition formatting)
│           └── context/     # React contexts (AuthContext)
└── packages/
    └── common/              # Shared types/utilities
```

## 🔄 Development Workflow

1. **Backend Changes**: Modify API routes in `apps/api/src/routes/`
2. **Frontend Changes**: Update components in `apps/mobile/src/`
3. **Database Changes**: Update Prisma schema and run migrations
4. **Testing**: Use the mobile app to test all functionality

## 🎯 Next Steps

1. **Implement Task Creation UI** in mobile app
2. **Add Task Editing** functionality
3. **Enhance Chat AI** with voice input and task creation from chat
4. **Add Push Notifications** for task reminders and nutrition goals
5. **Implement Barcode Scanning** for quick nutrition logging
6. **Add Nutrition Analytics** with weekly/monthly insights
7. **Implement Bulk Acceptance** for multiple AI suggestions

## 📝 Notes

- The mobile app uses `localhost` for development but should be configured with the host machine's IP for device testing
- All API endpoints require JWT authentication
- XP is automatically calculated and awarded on task completion
- The dashboard provides real-time updates of user progress, task statistics, and nutrition goals
- Chat conversations are context-aware and persist across app sessions
- AI responses use GPT-4o-mini for cost efficiency while maintaining quality
- The chat interface includes keyboard-aware layout, proper text spacing, and AI tools
- **Multiple AI suggestions** are supported and displayed in organized groups
- **Suggestion acceptance** includes state management - suggestions disappear after acceptance
- Nutrition tracking provides MyFitnessPal-like functionality with AI integration
- AI can suggest meals and foods that can be directly added to the nutrition journal
- **All nutrition values** are formatted consistently without unnecessary decimals
- The system includes comprehensive retry mechanisms for both backend and frontend operations
- **Shared utility functions** ensure consistent formatting across all nutrition displays 