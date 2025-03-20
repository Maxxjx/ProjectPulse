import { PrismaClient } from "@prisma/client"
import { mockProjects, mockTasks, mockUsers } from "./mockData"

// This function initializes the database with mock data if it's empty
// but it's never called in the application flow
export async function initDatabase() {
  const prisma = new PrismaClient()

  try {
    // Check if database is empty
    const userCount = await prisma.user.count()

    if (userCount === 0) {
      console.log("Initializing database with mock data...")

      // Create users
      for (const user of mockUsers) {
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        })
      }

      // Create projects
      for (const project of mockProjects) {
        await prisma.project.create({
          data: {
            id: project.id,
            name: project.name,
            description: project.description,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            // Connect to manager
            managerId: project.managerId,
          },
        })
      }

      // Create tasks
      for (const task of mockTasks) {
        await prisma.task.create({
          data: {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            projectId: task.projectId,
            assigneeId: task.assigneeId,
          },
        })
      }

      console.log("Database initialized successfully!")
    } else {
      console.log("Database already contains data, skipping initialization.")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    await prisma.$disconnect()
  }
}

