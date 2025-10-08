# API Development - Quick Reference

## 🚀 Quick Start

```bash
# Build the API
npx nx build @businessdirectory/api

# Run it
npm run start:api
```

Server starts at: `http://localhost:3333`

## 🔄 Development Mode (Recommended)

### Option 1: Manual Watch

```bash
# Terminal 1: Build on changes
npx nx build @businessdirectory/api --watch

# Terminal 2: Run with auto-restart
cd apps/api && npx nodemon dist/main.js
```

### Option 2: Single Command

```bash
npm run dev
```

## ⚠️ Why not `nx serve`?

The `nx serve` command has Windows permission issues when trying to clean the dist folder. Use the methods above instead.

## 📝 Common Tasks

```bash
# Rebuild fresh (if issues)
npx nx reset
npx nx build @businessdirectory/api --skip-nx-cache

# Regenerate Prisma
npx nx run @businessdirectory/database:prisma:generate

# Seed database
npm run db:seed

# Lint
npx nx lint @businessdirectory/api
```

## 🐛 Troubleshooting

**Permission Error?**

```bash
taskkill /F /IM node.exe  # Kill node processes
npx nx reset              # Clear cache
```

**Module not found?**

```bash
npx nx build @businessdirectory/database
npx nx build @businessdirectory/api
```

See `../../DEVELOPMENT_GUIDE.md` for complete documentation.
