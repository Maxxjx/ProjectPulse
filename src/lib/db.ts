import { PrismaClient } from "@prisma/client"

// Declare global type for prisma instance in development
declare global {
  var prisma: PrismaClient | undefined
}

// Function to create and validate a Prisma client
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

  return client
}

// Initialize and validate the Prisma client
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient()
} else {
  // This prevents multiple instances during development due to hot reloading
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  prisma = global.prisma
}
// Validate database connection on startup
;(async () => {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`
    console.log("✅ Database connection established successfully")

    // Initialize database with mock data if empty
    if (process.env.INIT_DB === "true") {
      const { initDatabase } = await import("./data/initDatabase")
      await initDatabase()
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    console.warn("Application will fall back to mock data")

    // Set environment flag to use mock data
    process.env.USE_PRISMA = "false"
  }
})()

export default prisma

