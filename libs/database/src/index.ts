// Export Prisma Client (primary exports)
export * from './generated/client/index.js';

// Export Zod schemas under a namespace to avoid conflicts
export * as zodSchemas from './generated/zod/index.js';

// Export a singleton instance for the API
export { prisma } from './lib/prisma.js';
