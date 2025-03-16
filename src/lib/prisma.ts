import { PrismaClient } from '@prisma/client';

// Using a single PrismaClient instance for better performance
// as per Prisma's recommendations
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

// This is important - prevents Prisma Client being loaded in the browser
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// PrismaClient should only be instantiated on the server side
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Function to test the database connection - only for server components
export async function testDatabaseConnection() {
  // Check if running on the server
  if (typeof window !== 'undefined') {
    console.warn('Database connection test attempted in browser environment');
    return false;
  }
  
  try {
    // Try a simple query to check if the database is connected
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Safe version that can be imported in client components
// This returns a boolean indicating if we're in a server environment
export function isDatabaseEnvironment() {
  return typeof window === 'undefined';
}