@echo off
set DATABASE_URL=file:./prisma/dev.db
set JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
set OPENAI_API_KEY=your-openai-api-key-here
set PORT=4000

echo Starting API with environment variables...
pnpm dev 