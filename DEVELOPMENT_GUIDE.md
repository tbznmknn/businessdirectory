# Development Guide

## Running the API in Development Mode

### ⚠️ Known Issue with `nx serve`

The `nx serve` command has permission issues on Windows when trying to rebuild. This causes an I/O error or EPERM error when deleting the dist folder.

### ✅ Recommended Development Workflows

#### **Option 1: Build + Run (Simple)**

```bash
# Build the API
npx nx build @businessdirectory/api

# Run the built version
npm run start:api
# or
node apps/api/dist/main.js
```

#### **Option 2: Watch + Auto-Reload (Recommended)**

Using nodemon to watch for changes and auto-restart:

```bash
# Terminal 1: Build in watch mode
npx nx build @businessdirectory/api --watch

# Terminal 2: Run with nodemon for auto-restart
cd apps/api
npx nodemon dist/main.js
```

#### **Option 3: Using npm scripts**

```bash
# Start the API (production mode)
npm run start:api

# Development with auto-reload (using nodemon config)
npm run dev
# or
npm run dev:api
```

### 📝 Available Scripts

In `package.json`:

```json
{
  "scripts": {
    "dev": "cd apps/api && npx nodemon",
    "dev:api": "cd apps/api && npx nodemon",
    "start:api": "node apps/api/dist/main.js",
    "db:seed": "ts-node apps/api/src/helpers/seed.ts",
    "db:reset": "npx nx run @businessdirectory/database:prisma:push && npm run db:seed"
  }
}
```

### 🔧 Nodemon Configuration

Created `apps/api/nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts,js,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts", "dist"],
  "exec": "npx nx build @businessdirectory/api --skip-nx-cache && node dev.js",
  "delay": "1000"
}
```

This watches the `src` folder and rebuilds + restarts on changes.

### 🐛 Troubleshooting

#### Issue: Permission Denied / EPERM Error

**Problem:**

```
Error: EPERM, Permission denied: ...\apps\api\dist
```

**Solution:**

1. Kill all Node processes:

   ```bash
   # Windows
   taskkill /F /IM node.exe

   # Linux/Mac
   pkill node
   ```

2. Clear Nx cache:

   ```bash
   npx nx reset
   ```

3. Rebuild:
   ```bash
   npx nx build @businessdirectory/api --skip-nx-cache
   ```

#### Issue: Nx I/O Error

**Problem:**

```
NX   Io error. Look inside err_kind for more details.
```

**Solution:**

```bash
# Clear cache and rebuild
npx nx reset
npx nx build @businessdirectory/api --skip-nx-cache
```

#### Issue: Module Not Found at Runtime

**Problem:**

```
Cannot find module '@businessdirectory/database'
```

**Solution:**

```bash
# Rebuild the database library
npx nx build @businessdirectory/database

# Regenerate Prisma client
npx nx run @businessdirectory/database:prisma:generate

# Rebuild API
npx nx build @businessdirectory/api
```

### 🚀 Quick Start (First Time)

```bash
# 1. Install dependencies
npm install

# 2. Setup database
npx nx run @businessdirectory/database:prisma:push

# 3. Seed database
npm run db:seed

# 4. Build the API
npx nx build @businessdirectory/api

# 5. Start the server
npm run start:api
```

### 🔄 Development Workflow (Daily)

**Recommended:**

```bash
# Terminal 1: Watch and build
npx nx build @businessdirectory/api --watch

# Terminal 2: Run and auto-restart
cd apps/api
npx nodemon dist/main.js
```

**Alternative (if nodemon configured):**

```bash
npm run dev
```

### 📊 Testing the API

Once the server is running on `http://localhost:3333`:

```bash
# Health check
curl http://localhost:3333/api/v1/health

# Login
curl -X POST http://localhost:3333/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@business.mn","password":"password123"}'

# Get categories
curl http://localhost:3333/api/v1/business-categories
```

### 🛠️ Build Commands Reference

```bash
# Build API only
npx nx build @businessdirectory/api

# Build API with watch mode
npx nx build @businessdirectory/api --watch

# Build API without cache
npx nx build @businessdirectory/api --skip-nx-cache

# Build all projects
npx nx run-many -t build

# Lint
npx nx lint @businessdirectory/api

# Reset Nx cache
npx nx reset
```

### 📦 Production Build

```bash
# Build for production
npx nx build @businessdirectory/api --configuration=production

# Run production build
NODE_ENV=production node apps/api/dist/main.js
```

### 🔐 Environment Variables

Make sure `.env` exists in the workspace root:

```env
DATABASE_URL="mysql://root:@localhost:3306/radnadir"
JWT_SECRET="your-secret-key-here"
PORT=3333
NODE_ENV=development
CORS_ORIGIN="*"
```

### 💡 Tips

1. **Always build before running** - The API runs from the `dist` folder
2. **Use `--skip-nx-cache`** if you encounter permission issues
3. **Clear node processes** before rebuilding if you get EPERM errors
4. **Use nodemon** for the best development experience
5. **Check logs** in `logs/` folder for debugging

### 🎯 Summary

**Production:** ✅ `nx build` → `node dist/main.js` works perfectly

**Development:** ⚠️ `nx serve` has issues on Windows

**Workaround:** ✅ Use `nx build --watch` + `nodemon` for development

This setup provides a reliable development experience while the Nx team fixes the Windows permission issues with hot reload.
