# 🚀 Setup Guide

This guide will help you set up the ProductivityLeveling project using pnpm.

## Prerequisites

- Node.js 18+ 
- pnpm 8+
- Expo CLI (for mobile development)
- Docker (optional, for PostgreSQL)

## Quick Setup

### 1. Install Dependencies

```bash
# Install all dependencies for the monorepo
pnpm install
```

### 2. Backend Setup

```bash
cd apps/api

# Copy environment file (already has all required variables)
cp .env.example .env

# Edit .env file with your values:
# - JWT_SECRET: Generate a secure random string
# - OPENAI_API_KEY: Your OpenAI API key (optional for basic functionality)
# - DATABASE_URL: Use SQLite for development (already set)

# Generate Prisma client
pnpm prisma generate

# Create database and run migrations
pnpm prisma db push

# Seed the database with sample data
pnpm run seed

# Start the development server
pnpm run dev
```

### 3. Mobile App Setup

```bash
cd apps/mobile

# Start the Expo development server
pnpm start
```

## Environment Variables

### Backend (.env)

The `.env.example` file already contains all required variables:

```env
# Database Configuration
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:./dev.db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration (optional)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server Configuration
PORT=4000
NODE_ENV=development
```

### Mobile

The mobile app uses `process.env.EXPO_PUBLIC_API_URL` which works fine with Expo. The configuration is set up in `app.config.ts`.

## Development Scripts

### Root Level (Monorepo)

```bash
# Install all dependencies
pnpm install

# Start both backend and mobile in parallel
pnpm dev

# Start backend development server only
pnpm dev:api

# Start mobile development server only
pnpm dev:mobile

# Build backend
pnpm build:api

# Build mobile app
pnpm build:mobile

# Clean all node_modules
pnpm clean
```

### Backend (apps/api)

```bash
# Development with hot reload
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start

# Database operations
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
```

### Mobile (apps/mobile)

```bash
# Start Expo development server
pnpm start

# Run on Android
pnpm run android

# Run on iOS
pnpm run ios

# Build with EAS
pnpm run build
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Most will resolve after `pnpm install`. The project includes proper type definitions in `src/types.ts`.

2. **Prisma Issues**: 
   ```bash
   cd apps/api
   pnpm prisma generate
   pnpm prisma db push
   ```

3. **Expo Issues**:
   ```bash
   cd apps/mobile
   pnpm expo install --fix
   ```

4. **Port Conflicts**: Change the PORT in `.env` if 4000 is already in use

### Database Setup

The project uses SQLite by default for development. To use PostgreSQL:

1. Update `DATABASE_PROVIDER=postgresql` in `.env`
2. Update `DATABASE_URL` to point to your PostgreSQL instance
3. Run `pnpm prisma db push` to create tables

### Mobile Development

- Install Expo Go on your device for testing
- Use `pnpm start` to start the development server
- Scan the QR code with Expo Go

## Production Deployment

### Backend

1. Build the Docker image:
   ```bash
   cd apps/api
   docker build -t productivity-api .
   ```

2. Run with environment variables:
   ```bash
   docker run -d -p 4000:4000 \
     -e DATABASE_PROVIDER=postgresql \
     -e DATABASE_URL=your-postgres-url \
     -e JWT_SECRET=your-secret \
     -e OPENAI_API_KEY=your-key \
     productivity-api
   ```

### Mobile

1. Update `apiUrl` in `app.config.ts` to point to your hosted API
2. Build with EAS:
   ```bash
   cd apps/mobile
   pnpm run build
   ```

## Project Structure

```
ProductivityLeveling/
├── package.json              # Root monorepo config
├── pnpm-workspace.yaml       # pnpm workspace config
├── apps/
│   ├── api/                  # Express.js backend
│   └── mobile/               # Expo React Native app
└── packages/
    └── common/               # Shared utilities (future)
```

## Key Features

- **Monorepo**: Properly configured with pnpm workspaces
- **TypeScript**: Full type safety with shared interfaces
- **Expo**: Modern React Native development with Expo Router v3
- **Prisma**: Type-safe database operations
- **JWT Auth**: Secure authentication system
- **OpenAI Integration**: AI-powered features

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try cleaning and reinstalling dependencies: `pnpm clean && pnpm install`
4. Check the logs for specific error messages 