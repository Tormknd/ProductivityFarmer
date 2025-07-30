# ProductivityLeveling

> **One app to manage tasks, meals & motivation — with a pixel-art twist.**

A comprehensive productivity app built with a monorepo architecture featuring an Express.js backend and Expo React Native frontend.

<div align="center">
  <!-- replace with actual screenshot -->
  <img src="docs/hero.png" width="600" alt="App hero screenshot"/>
</div>

## 🚀 Features

- ✅ **Unified dashboard** — today's tasks, calories & XP at a glance  
- ✅ **Task manager** — due dates, reminders, streak bonus  
- ✅ **Nutrition log** — manual entry **+ barcode scanner** (Expo Camera)  
- ✅ **Gamified XP** — weighted points, level-up confetti, progress bars  
- ✅ **AI chat assistant** (OpenAI o3) — meal ideas & brainstorming help  
- ✅ **Dark pixel-art UI** — #121212 base, yellow #FFD54F accents, electric-blue highlights  
- ♿ **WCAG AA contrast** & 48 × 48 dp touch targets

---

## 🏗️ Project Structure

This project follows a **pnpm monorepo** pattern with shared packages and separate applications for backend and frontend. The workspace is managed by `pnpm-workspace.yaml` and includes shared dependencies and scripts.

```
ProductivityLeveling/
├── apps/
│   ├── api/                    # Express.js Backend API
│   └── mobile/                 # Expo React Native App
└── packages/
    └── common/                 # Shared Types & Utilities
```

<details>
<summary>Full tree</summary>

```
ProductivityLeveling/
├── apps/
│   ├── api/                    # Express.js Backend API
│   │   ├── Dockerfile          # Container configuration
│   │   ├── docker-compose.yml  # PostgreSQL service setup
│   │   ├── package.json        # Dependencies & scripts
│   │   ├── tsconfig.json       # TypeScript configuration
│   │   ├── .env.example        # Environment variables template
│   │   ├── prisma/             # Database schema & migrations
│   │   │   ├── schema.prisma   # Database schema definition
│   │   │   └── seed.ts         # Database seeding script
│   │   └── src/
│   │       ├── index.ts        # Express app bootstrap
│   │       ├── lib/            # External service integrations
│   │       │   └── openai.ts   # OpenAI API integration
│   │       ├── middleware/     # Express middleware
│   │       │   └── auth.ts     # JWT authentication middleware
│   │       ├── routes/         # API route handlers
│   │       │   ├── auth.ts     # Authentication endpoints
│   │       │   ├── tasks.ts    # Task management endpoints
│   │       │   ├── meals.ts    # Meal tracking endpoints
│   │       │   ├── foods.ts    # Food database endpoints
│   │       │   ├── xp.ts       # Experience system endpoints
│   │       │   └── chat.ts     # AI chat endpoints
│   │       └── types/          # TypeScript type definitions
│   │           └── express.d.ts # Express request augmentation
│   └── mobile/                 # Expo React Native App
│       ├── app/                # Expo Router v3 (file-based routing)
│       │   ├── (tabs)/         # Bottom tab navigation group
│       │   │   ├── _layout.tsx # TabNavigator configuration
│       │   │   ├── index.tsx   # Dashboard screen
│       │   │   ├── tasks.tsx   # Task management screen
│       │   │   ├── nutrition.tsx # Nutrition tracking screen
│       │   │   ├── chat.tsx    # AI chat interface
│       │   │   └── settings.tsx # App settings & preferences
│       │   ├── _layout.tsx     # Root stack navigator (Auth → Tabs)
│       │   └── auth/           # Authentication screens
│       │       ├── login.tsx   # User login
│       │       └── register.tsx # User registration
│       ├── src/
│       │   ├── api/            # Typed API client wrappers
│       │   │   ├── client.ts   # Axios instance + auth headers
│       │   │   ├── tasks.ts    # Task-related API calls
│       │   │   ├── meals.ts    # Meal tracking API calls
│       │   │   ├── foods.ts    # Food database API calls
│       │   │   ├── xp.ts       # Experience points API calls
│       │   │   └── chat.ts     # AI chat API calls
│       │   ├── components/     # Reusable UI components
│       │   │   ├── TaskItem.tsx # Individual task display
│       │   │   ├── MealCard.tsx # Meal information card
│       │   │   ├── XPBar.tsx   # Experience progress bar
│       │   │   ├── BarcodeScanner.tsx # Camera-based barcode scanner
│       │   │   └── ChatBubble.tsx # Chat message component
│       │   ├── context/        # React Context providers
│       │   │   └── AuthContext.tsx # JWT authentication state
│       │   ├── hooks/          # Custom React hooks
│       │   │   └── useNotifications.ts # Push notification management
│       │   ├── theme.ts        # Design system & dark theme
│       │   └── lib/            # Utility functions
│       │       └── xp.ts       # Experience calculation helpers
│       ├── app.config.ts       # Expo configuration + environment
│       ├── tsconfig.json       # TypeScript configuration
│       └── global.css          # Global styles
└── packages/
    └── common/                 # Shared Types & Utilities
```

</details>

---

## 📦 Monorepo Benefits

- **Shared Dependencies**: Common packages and types across apps
- **Unified Development**: Single command to start all services
- **Consistent Tooling**: Same linting, testing, and build processes
- **Efficient Development**: Hot reload for both API and mobile simultaneously

### Workspace Management
- `pnpm install` - Install all dependencies across all packages
- `pnpm dev` - Start both API and mobile in development mode
- `pnpm --filter <package> <command>` - Run commands in specific packages

---

## 🛠️ Tech Stack

| Layer      | Tools / Libraries                                                                                                    |
|------------|----------------------------------------------------------------------------------------------------------------------|
| **Mobile** | Expo SDK 50 · React Native 0.74 · Expo Router v3 · React Query v5 · NativeWind · Expo Camera & Barcode Scanner        |
|            | Reanimated v3 · Expo Notifications · **Secure Store** for JWT                                                         |
| **Backend**| Node 18 · Express 4 · Prisma 5 · SQLite (dev) / Postgres (prod) · JWT auth · OpenAI SDK (o3)                          |
| **Infra**  | Docker · docker-compose · **pnpm monorepo** · EAS Build (iOS / Android)                                                |

---

## 📋 Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 LTS | <https://nodejs.org> |
| pnpm | ≥ 8 | `npm i -g pnpm` |
| Expo CLI | ≥ 7 | `npm i -g expo-cli` |
| Docker | ≥ 24 | <https://docs.docker.com/get-docker/> |

> 📱 On a real device you'll need **Expo Go** or a custom dev-client (EAS).

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-org/productivity-leveling.git
cd productivity-leveling

# Install all dependencies (pnpm monorepo)
pnpm install

# ① BACKEND SETUP
cd apps/api

# Initialize database
pnpm prisma db push
pnpm run seed                  # demo foods
pnpm run dev                   # → http://localhost:4000
# leave this terminal running

# ② MOBILE (new terminal)
cd ../mobile
pnpm start                     # press i / a / w for iOS / Android / Web
```

---

## 🔧 Environment Variables

**Important:** The API uses `cross-env` to ensure environment variables are properly loaded across different platforms. The environment variables are set directly in the `package.json` scripts.

| Variable              | Scope   | Example                 | Notes             |
| --------------------- | ------- | ----------------------- | ----------------- |
| `DATABASE_PROVIDER`   | backend | `sqlite` / `postgresql` |                   |
| `DATABASE_URL`        | backend | `file:./dev.db`         |                   |
| `JWT_SECRET`          | backend | `change-me-now`         | rotate in prod    |
| `OPENAI_API_KEY`      | backend | `sk-…`                  |                   |
| `EXPO_PUBLIC_API_URL` | mobile  | `http://localhost:4000` | injected at build |

### Environment Variable Loading Issue

**Problem:** Environment variables from `.env` files weren't being loaded properly when using `pnpm dev` on Windows.

**Solution:** Using `cross-env` in the package.json scripts to explicitly set environment variables:

```json
{
  "scripts": {
    "dev": "cross-env DATABASE_URL=file:./prisma/dev.db JWT_SECRET=your-secret OPENAI_API_KEY=your-key PORT=4000 nodemon --watch src --exec \"ts-node src/index.ts\""
  }
}
```

This ensures environment variables are available to the Node.js process regardless of the platform or shell being used.

---

## 📜 Common Scripts

| Directory | Script                            | Action                        |
| --------- | --------------------------------- | ----------------------------- |
| **Root**  | `pnpm install`                    | Install all dependencies       |
|           | `pnpm dev`                        | Start both API & mobile        |
|           | `pnpm dev:api`                    | Start API only                |
|           | `pnpm dev:mobile`                 | Start mobile only              |
| `apps/api` | `pnpm run dev`                    | Hot-reload API                |
|           | `pnpm run build`                  | Compile TS → dist             |
|           | `pnpm run seed`                   | Populate base foods           |
| `apps/mobile`  | `pnpm start`                      | Expo dev server               |
|           | `pnpm run android` / `pnpm run ios` | Open emulator / simulator     |
|           | `pnpm run build`                  | `eas build` cloud compilation |

---

## 📱 Mobile App (`apps/mobile/`)

### Overview
React Native app built with Expo Router v3 for file-based navigation and TypeScript for type safety.

### Key Features
- **File-based Routing**: Expo Router v3 for intuitive navigation
- **Type Safety**: Full TypeScript implementation
- **Dark Theme**: Consistent design system with dark mode support
- **Authentication**: JWT-based auth with secure token storage
- **API Integration**: Typed API clients with React Query
- **Push Notifications**: Task reminders and productivity alerts
- **Barcode Scanning**: Camera integration for food tracking

---

## 🖥️ Backend API (`apps/api/`)

### Overview
Express.js REST API with TypeScript, Prisma ORM, and PostgreSQL database.

### Key Features
- **RESTful API**: Clean, RESTful endpoint design
- **Database ORM**: Prisma for type-safe database operations
- **Authentication**: JWT-based user authentication
- **AI Integration**: OpenAI API for intelligent features
- **Containerization**: Docker support for easy deployment
- **Type Safety**: Full TypeScript implementation
- **Environment Management**: Secure configuration handling

---

## 📦 Shared Packages (`packages/common/`)

### Overview
Shared utilities, types, and API client hooks used across both frontend and backend.

### Purpose
- **Type Definitions**: Shared TypeScript interfaces
- **API Client Hooks**: Reusable React Query hooks
- **Utility Functions**: Common helper functions
- **Constants**: Shared configuration values

---

## 📋 Implementation Status

### ✅ **Completed Features**

#### Backend API
- [x] **Authentication System**: JWT-based login/register with bcrypt password hashing
- [x] **Task Management**: CRUD operations for tasks with XP rewards
- [x] **Meal Tracking**: Food logging and nutrition tracking
- [x] **Food Database**: Barcode-based food lookup system
- [x] **Experience System**: XP logging and level calculation
- [x] **Database Schema**: Complete Prisma schema with relationships
- [x] **API Routes**: All RESTful endpoints implemented
- [x] **Authentication Middleware**: JWT token validation
- [x] **Docker Configuration**: Containerization setup
- [x] **Database Seeding**: Initial food data population
- [x] **Environment Variable Loading**: Fixed with cross-env

#### Mobile App - Core Infrastructure
- [x] **Navigation Structure**: Expo Router v3 with tab navigation (FIXED ✅)
- [x] **Authentication Flow**: Login/register with JWT token management
- [x] **Authentication Context**: React Context for state management
- [x] **Secure Token Storage**: Expo SecureStore for JWT persistence
- [x] **API Client Setup**: Axios instance with auth headers
- [x] **Environment Configuration**: app.config.ts for API URL injection
- [x] **Basic UI Components**: Dark theme with consistent styling
- [x] **Tab Navigation**: Working navigation between screens

#### Mobile App - Screens (Basic UI Only)
- [x] **Dashboard**: Welcome screen with user info display
- [x] **Tasks**: Placeholder screen with "coming soon" message
- [x] **Nutrition**: Placeholder screen with barcode scanner button
- [x] **Chat**: Placeholder screen with input field (no API integration)
- [x] **Settings**: Logout functionality working

### 🔄 **Partially Implemented (From mobile-old-working)**

#### Components (Available but not integrated)
- [ ] **TaskItem**: Individual task display component
- [ ] **MealCard**: Meal information card component
- [ ] **XPBar**: Experience progress bar component
- [ ] **ChatBubble**: Chat message component
- [ ] **BarcodeScanner**: Camera-based barcode scanner component

#### API Integration (Hooks available but not used)
- [ ] **useTasks**: React Query hook for task management
- [ ] **useAddTask**: Mutation hook for creating tasks
- [ ] **useMeals**: Hook for meal tracking
- [ ] **useFoods**: Hook for food database
- [ ] **useXP**: Hook for experience points
- [ ] **useChat**: Hook for AI chat functionality

#### Type Definitions (Available but not used)
- [ ] **Task Interface**: Complete task type definitions
- [ ] **Food Interface**: Food and nutrition types
- [ ] **Meal Interface**: Meal tracking types
- [ ] **User Interface**: User profile types
- [ ] **XP Interface**: Experience system types
- [ ] **Chat Interface**: Chat message types

### ❌ **Missing/Not Implemented**

#### Core Functionality
- [ ] **Real API Integration**: Currently using placeholder screens
- [ ] **Task Management**: No actual task CRUD operations
- [ ] **Nutrition Tracking**: No barcode scanning or food logging
- [ ] **AI Chat**: No OpenAI integration or message handling
- [ ] **XP System**: No experience points calculation or display
- [ ] **Push Notifications**: No notification system
- [ ] **Error Handling**: No comprehensive error management
- [ ] **Loading States**: No loading indicators or skeleton screens

#### Advanced Features
- [ ] **Offline Support**: No local data caching
- [ ] **Data Validation**: No input validation or error messages
- [ ] **Testing**: No unit or integration tests
- [ ] **Performance Optimization**: No lazy loading or optimization
- [ ] **Accessibility**: No WCAG compliance features

### 📋 **Immediate Next Steps (Priority Order)**

1. **🔧 Fix Navigation Issues** ✅ **COMPLETED**
   - Fixed missing `index.tsx` file in `(tabs)` directory
   - Authentication flow now works correctly
   - Login/logout navigation functioning

2. **🔌 Connect Real API Integration**
   - Replace placeholder screens with actual API calls
   - Integrate React Query hooks from `mobile-old-working`
   - Add proper error handling and loading states

3. **📱 Implement Task Management**
   - Integrate `TaskItem` component
   - Connect `useTasks` and `useAddTask` hooks
   - Add task creation, completion, and deletion

4. **🍎 Add Nutrition Tracking**
   - Integrate `BarcodeScanner` component
   - Connect `useFoods` and `useMeals` hooks
   - Implement food logging functionality

5. **🤖 Enable AI Chat**
   - Integrate `ChatBubble` component
   - Connect `useChat` hook
   - Implement OpenAI API integration

6. **⭐ Add XP System**
   - Integrate `XPBar` component
   - Connect `useXP` hook
   - Display user progress and levels

### 📊 **Progress Summary**

| Feature Category | Status | Progress |
|-----------------|--------|----------|
| **Navigation & Auth** | ✅ Complete | 100% |
| **Backend API** | ✅ Complete | 100% |
| **UI Components** | 🔄 Available | 80% |
| **API Integration** | ❌ Missing | 0% |
| **Core Functionality** | ❌ Missing | 0% |
| **Advanced Features** | ❌ Missing | 0% |

**Overall Project Progress: ~35%**

---

## 🚀 Deployment

### API (Docker + Postgres)

```bash
cd apps/api
docker build -t productivity-api .
docker run -d -p 4000:4000 \
  -e DATABASE_PROVIDER=postgresql \
  -e DATABASE_URL=postgresql://user:pass@db:5432/productivity \
  -e JWT_SECRET=$JWT_SECRET \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  productivity-api
```

### Mobile (EAS Build)

1. Update `apiUrl` in `app.config.ts` to point to your hosted API.
2. `eas build --profile production --platform ios,android`
3. Submit via EAS Submit or respective stores.

---

## 🧪 Testing

| Layer | Library                       | Folder             |
| ----- | ----------------------------- | ------------------ |
| API   | Jest + supertest              | `apps/api/tests`    |
| App   | @testing-library/react-native | `apps/mobile/__tests__` |

---

## 🔒 Security

* **Never commit `.env`, database dumps, or OpenAI keys.**
* Rotate `JWT_SECRET` periodically; revoke existing tokens when you do.
* Add Zod / Express-validator for payload validation before production.

---

## 🔧 Known Issues & Next Steps

### **✅ Recently Fixed**
1. **Navigation Issues**: Fixed "unmatched route" error by creating missing `index.tsx` file
2. **Authentication Flow**: Login/logout navigation now works correctly
3. **Environment Configuration**: Mobile app properly configured with API URL injection
4. **Environment Variable Loading**: Fixed with cross-env in package.json scripts

### **Current Issues**
1. **Placeholder Screens**: All main screens (Tasks, Nutrition, Chat) are placeholders
2. **No Real API Integration**: Mobile app not connected to backend API
3. **Missing Components**: UI components from `mobile-old-working` not integrated
4. **No Functionality**: Core features (task management, nutrition tracking, chat) not implemented

### **Immediate Next Steps**
1. **🔌 Connect API Integration**: Replace placeholder screens with real API calls
2. **📱 Implement Task Management**: Integrate TaskItem component and useTasks hook
3. **🍎 Add Nutrition Tracking**: Integrate BarcodeScanner and food logging
4. **🤖 Enable AI Chat**: Connect OpenAI integration and ChatBubble component
5. **⭐ Add XP System**: Display user progress with XPBar component

### **Development Approach**
- **Copy from mobile-old-working**: Most components and API hooks are already implemented
- **Gradual Integration**: Add features one by one, testing each step
- **Maintain Navigation**: Keep the working navigation structure intact

---

## 🤝 Contributing

1. Fork → feature branch → PR.
2. Run `pnpm lint` and `pnpm test` (CI enforces).
3. Squash-merge with a clear commit message.

---

## 📄 License

MIT © 2025 ProductivityLeveling Team

---

> Need help? Open an issue or ping **@your-handle** on X/Twitter.

**Built with ❤️ for productivity enthusiasts** 