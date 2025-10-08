// Export Prisma Client
export * from './generated/client';
export { PrismaClient } from './generated/client';

// Export Zod schemas
export * from './generated/zod';

// Export a singleton instance for the API
export { prisma } from './lib/prisma';
