# ProductivityLeveling

A comprehensive productivity application with a pnpm monorepo structure featuring an Express.js backend and Expo React Native frontend.

## 🚀 Current Status

### ✅ Successfully Implemented

#### Backend API (Express.js + Prisma + SQLite)
- **Authentication System**: JWT-based auth with registration/login endpoints
- **Task Management**: Complete CRUD operations with user ownership
  - `GET /tasks` - Fetch user's tasks
  - `POST /tasks` - Create new task with importance levels
  - `PUT /tasks/:id` - Update task details
  - `PUT /tasks/:id/complete` - Complete task and award XP
  - `DELETE /tasks/:id` - Delete task
- **XP System**: Automatic XP rewards based on task importance
- **Importance System**: 5 levels (Low: 5XP, Medium: 10XP, High: 15XP, Critical: 25XP, Epic: 40XP)
- **User Management**: User profile with XP tracking
- **Database**: SQLite with Prisma ORM, updated schema with importance field

#### Mobile App (Expo React Native)
- **Authentication**: Login/Register screens with JWT token persistence
- **Dashboard**: Complete overview with:
  - User XP and level display with progress bar
  - Task statistics (completed, pending, total)
  - Recent tasks list
  - Real-time data from API
- **Task Management**: Full CRUD functionality
  - View all tasks with completion status and importance levels
  - Add new tasks with importance selection (auto-calculates XP)
  - Complete tasks (awards XP automatically)
  - Delete tasks with confirmation
- **Importance UI**: MMORPG-themed importance selection with fantasy icons
- **Navigation**: Tab-based navigation with Expo Router v3
- **State Management**: React Query v5 for API data fetching
- **UI/UX**: Modern dark theme with MMORPG styling and animations

#### Technical Implementation
- **API Client**: Axios with automatic token injection and error handling
- **Data Fetching**: React Query hooks for tasks and user data
- **Authentication Context**: JWT token management with SecureStore
- **XP Calculation**: Level system based on square root formula
- **Error Handling**: Comprehensive error states and user feedback
- **Debug Tools**: Extensive logging for development and troubleshooting

### 🔧 How It Works

1. **Authentication Flow**:
   - User registers/logs in via mobile app
   - JWT token stored in Expo SecureStore
   - Token automatically included in all API requests

2. **Task Management Flow**:
   - Tasks are created with importance levels (Low, Medium, High, Critical, Epic)
   - Importance automatically determines XP reward (5, 10, 15, 25, 40 XP)
   - Completing a task automatically awards XP
   - XP updates trigger level recalculation
   - Dashboard shows real-time progress

3. **Data Flow**:
   - React Query manages API state and caching
   - Automatic refetching on mutations
   - Optimistic updates for better UX

### 📱 Current Features

- **Dashboard**: Welcome message, XP display, task statistics, recent tasks
- **Tasks Tab**: Full task management interface
- **Chat Tab**: Placeholder for future AI integration
- **Nutrition Tab**: Placeholder for meal tracking
- **Settings Tab**: Basic settings interface

### 🚧 What's Missing

#### High Priority
- **Task Editing**: Edit task details (title, due date, importance) - UI ready, API needs update
- **Due Date Handling**: Task scheduling and reminders
- **Task Categories**: Organize tasks by type/project

#### Medium Priority
- **Chat Integration**: AI-powered productivity assistant
- **Nutrition Tracking**: Meal logging and nutritional insights
- **Notifications**: Push notifications for task reminders
- **Data Export**: Export task history and progress

#### Low Priority
- **Social Features**: Share progress with friends
- **Achievements**: Badges and milestones
- **Advanced Analytics**: Detailed productivity insights
- **Offline Support**: Work without internet connection

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18
- **Framework**: Express.js 4
- **Database**: SQLite (dev) + Prisma ORM
- **Authentication**: JWT
- **AI Integration**: OpenAI SDK (ready for chat features)

### Frontend
- **Framework**: Expo SDK 50 + React Native 0.74
- **Navigation**: Expo Router v3 (file-based routing)
- **State Management**: React Query v5
- **Storage**: Expo SecureStore (JWT tokens)
- **HTTP Client**: Axios

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

# Start the backend
cd apps/api
pnpm dev

# Start the mobile app (in another terminal)
cd apps/mobile
pnpm start
```

### Environment Variables
There is a `.env` file in the root directory that needs to be configured with:
```env
# Database
DATABASE_URL="file:./apps/api/prisma/dev.db"

# JWT
JWT_SECRET="your-secret-key"

# OpenAI (for future chat features)
OPENAI_API_KEY="your-openai-key"
```

## 📁 Project Structure

```
ProductivityLeveling/
├── apps/
│   ├── api/                 # Express.js backend
│   │   ├── src/
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── middleware/  # Auth middleware
│   │   │   └── lib/         # Utilities
│   │   └── prisma/          # Database schema
│   └── mobile/              # Expo React Native app
│       ├── app/             # Expo Router pages
│       └── src/
│           ├── api/         # API client and hooks
│           ├── components/  # Reusable components
│           └── context/     # React contexts
└── packages/
    └── common/              # Shared types/utilities
```

## 🔄 Development Workflow

1. **Backend Changes**: Modify API routes in `apps/api/src/routes/`
2. **Frontend Changes**: Update components in `apps/mobile/src/`
3. **Database Changes**: Update Prisma schema and run migrations
4. **Testing**: Use the mobile app to test all functionality

## 🎯 Next Steps

1. **✅ Task Creation UI** - COMPLETED with importance selection
2. **Add Task Editing** functionality (edit title, due date, importance)
3. **Integrate Chat AI** for productivity assistance
4. **Add Push Notifications** for task reminders
5. **Implement Nutrition Tracking** features

## 📝 Notes

- The mobile app uses `localhost` for development but should be configured with the host machine's IP for device testing
- All API endpoints require JWT authentication
- XP is automatically calculated based on task importance and awarded on task completion
- The dashboard provides real-time updates of user progress and task statistics
- Task importance levels: Low (5XP), Medium (10XP), High (15XP), Critical (25XP), Epic (40XP) 