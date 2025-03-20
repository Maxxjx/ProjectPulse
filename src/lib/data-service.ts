import type { DataService } from "./data/types"
import { MockDataService } from "./data/mockDataService"
import { ProjectService } from "./data/projectService"

/**
 * Factory function that returns the appropriate data service based on configuration
 * Prioritizes database access with fallback to mock data
 */
export const getDataService = (): DataService => {
  // Check environment variable properly
  const usePrisma = process.env.USE_PRISMA === "true"

  // Create both services for potential fallback
  const mockService = new MockDataService()

  if (usePrisma) {
    try {
      const dbService = new ProjectService()

      // Create a proxy service that falls back to mock data on errors
      return new Proxy(dbService, {
        get: (target, prop) => {
          const originalMethod = target[prop as keyof DataService]

          // If the property is not a function, return it directly
          if (typeof originalMethod !== "function") {
            return originalMethod
          }

          // Return a wrapped function that catches errors and falls back to mock data
          return async (...args: any[]) => {
            try {
              return await originalMethod.apply(target, args)
            } catch (error) {
              console.error(`Database operation failed for ${String(prop)}:`, error)
              console.log(`Falling back to mock data for ${String(prop)}`)

              // Fall back to the mock service method
              const mockMethod = mockService[prop as keyof DataService]
              if (typeof mockMethod === "function") {
                return mockMethod.apply(mockService, args)
              }
              throw error
            }
          }
        },
      })
    } catch (error) {
      console.error("Failed to initialize database service:", error)
      console.log("Using mock data service as fallback")
    }
  }

  // Return mock service if database is not enabled or initialization failed
  return mockService
}

// Export a singleton instance
export const dataService = getDataService()

