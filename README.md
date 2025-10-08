nx lint [web,api]

npx nx run-many -t build test

# Generate Prisma client + Zod schemas

npx nx run @businessdirectory/database:prisma:generate

# Create and apply migration (for development)

npx nx run @businessdirectory/database:prisma:migrate

# Push schema without migration (dev only - no migration history)

npx nx run @businessdirectory/database:prisma:push

# Open Prisma Studio (database GUI)

npx nx run @businessdirectory/database:prisma:studio
