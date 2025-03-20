import prisma from "./db"
import { initDatabase } from "./data/initDatabase"

/**
 * Initialize database connection and seed with mock data if needed
 * This function is called during application startup
 */
export async function initDatabaseConnection() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database connection established successfully")

    // Check if database needs initialization
    const userCount = await prisma.user.count()

    if (userCount === 0 && process.env.INIT_DB === "true") {
      console.log("Database is empty. Initializing with mock data...")
      await initDatabase()
    } else {
      console.log(`Database contains ${userCount} users. Skipping initialization.`)
    }

    // Set environment flag to use Prisma
    process.env.USE_PRISMA = "true"

    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    console.warn("Application will fall back to mock data")

    // Set environment flag to use mock data
    process.env.USE_PRISMA = "false"

    return false
  }
}

