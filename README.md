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

This project follows a monorepo pattern with shared packages and separate applications for backend and frontend.

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

## 🛠️ Tech Stack

| Layer      | Tools / Libraries                                                                                                    |
|------------|----------------------------------------------------------------------------------------------------------------------|
| **Mobile** | Expo SDK 50 · React Native 0.74 · Expo Router v3 · React Query v5 · NativeWind · Expo Camera & Barcode Scanner        |
|            | Reanimated v3 · Expo Notifications · **Secure Store** for JWT                                                         |
| **Backend**| Node 18 · Express 4 · Prisma 5 · SQLite (dev) / Postgres (prod) · JWT auth · OpenAI SDK (o3)                          |
| **Infra**  | Docker · docker-compose · pnpm / npm · EAS Build (iOS / Android)                                                      |

---

## 📋 Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 LTS | <https://nodejs.org> |
| pnpm (optional) | ≥ 8 | `npm i -g pnpm` |
| Expo CLI | ≥ 7 | `npm i -g expo-cli` |
| Docker | ≥ 24 | <https://docs.docker.com/get-docker/> |

> 📱 On a real device you'll need **Expo Go** or a custom dev-client (EAS).

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-org/productivity-leveling.git
cd productivity-leveling

# ① BACKEND
cd apps/api
cp .env.example .env          # set JWT_SECRET & OPENAI_API_KEY
npm install                   # or pnpm install
npx prisma db push            # create SQLite
npm run seed                  # demo foods
npm run dev                   # → http://localhost:4000
# leave this terminal running

# ② MOBILE (new terminal)
cd ../mobile
npm install                   # or pnpm install
npm start                     # press i / a / w for iOS / Android / Web
```

---

## 🔧 Environment Variables

| Variable              | Scope   | Example                 | Notes             |
| --------------------- | ------- | ----------------------- | ----------------- |
| `DATABASE_PROVIDER`   | backend | `sqlite` / `postgresql` |                   |
| `DATABASE_URL`        | backend | `file:./dev.db`         |                   |
| `JWT_SECRET`          | backend | `change-me-now`         | rotate in prod    |
| `OPENAI_API_KEY`      | backend | `sk-…`                  |                   |
| `EXPO_PUBLIC_API_URL` | mobile  | `http://localhost:4000` | injected at build |

---

## 📜 Common Scripts

| Directory | Script                            | Action                        |
| --------- | --------------------------------- | ----------------------------- |
| `apps/api` | `npm run dev`                     | Hot-reload API                |
|           | `npm run build`                   | Compile TS → dist             |
|           | `npm run seed`                    | Populate base foods           |
| `apps/mobile`  | `npm start`                       | Expo dev server               |
|           | `npm run android` / `npm run ios` | Open emulator / simulator     |
|           | `npm run build`                   | `eas build` cloud compilation |

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

#### Mobile App
- [x] **Navigation Structure**: Expo Router v3 with tab navigation
- [x] **Authentication Screens**: Login and registration forms
- [x] **Dashboard**: XP progress display and overview
- [x] **Task Management**: Task list with completion functionality
- [x] **Nutrition Tracking**: Barcode scanner integration
- [x] **Chat Interface**: Message display and input system
- [x] **Settings**: User preferences and logout
- [x] **API Integration**: React Query hooks for all endpoints
- [x] **UI Components**: Reusable components with dark theme
- [x] **Push Notifications**: Task reminder system
- [x] **State Management**: Context-based authentication state

### 🔄 **In Progress**
- [ ] **AI Chat Integration**: OpenAI API implementation in chat
- [ ] **Type Definitions**: Complete TypeScript interfaces
- [ ] **Error Handling**: Comprehensive error management
- [ ] **Testing**: Unit and integration tests

### 📋 **Planned Features**
- [ ] **Social Features**: Leaderboards and friend system
- [ ] **Advanced Analytics**: Detailed progress reporting
- [ ] **Health App Integration**: Apple Health/Google Fit sync
- [ ] **Offline Support**: Local data caching
- [ ] **Multi-language Support**: Internationalization
- [ ] **Advanced Notifications**: Smart reminder scheduling
- [ ] **Gamification**: Achievements and badges system

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

### **Current Issues**
1. **TypeScript Configuration**: Some type definition files need proper configuration
2. **Dependencies**: Missing type definitions for some packages
3. **Environment Variables**: Need proper .env.example file setup
4. **API Base URL**: Mobile app needs proper API URL configuration

### **Immediate Next Steps**
1. **Fix TypeScript Errors**: Resolve remaining type issues
2. **Complete AI Integration**: Implement OpenAI chat functionality
3. **Add Error Boundaries**: Implement proper error handling
4. **Testing Setup**: Add Jest and React Native Testing Library
5. **Documentation**: Add API documentation and usage examples

---

## 🤝 Contributing

1. Fork → feature branch → PR.
2. Run `npm run lint` and `npm test` (CI enforces).
3. Squash-merge with a clear commit message.

---

## 📄 License

MIT © 2025 ProductivityLeveling Team

---

> Need help? Open an issue or ping **@your-handle** on X/Twitter.

**Built with ❤️ for productivity enthusiasts** 