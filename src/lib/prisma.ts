import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export { prisma };