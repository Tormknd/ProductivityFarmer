# Set environment variables
$env:DATABASE_URL = "file:./prisma/dev.db"
$env:JWT_SECRET = "your-super-secret-jwt-key-change-this-in-production"
$env:OPENAI_API_KEY = "your-openai-api-key-here"
$env:PORT = "4000"

Write-Host "Starting API with environment variables..."
Write-Host "DATABASE_URL: $env:DATABASE_URL"
Write-Host "JWT_SECRET: $env:JWT_SECRET"
Write-Host "PORT: $env:PORT"

# Start the API
pnpm dev 