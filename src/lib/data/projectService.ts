import prisma from "../db"
import type { DataService, Project } from "./types"

// This service implements database access but is never used due to the issue in data-service.ts
export class ProjectService implements DataService {
  async getProjects(): Promise<Project[]> {
    try {
      const projects = await prisma.project.findMany({
        include: {
          manager: true,
          tasks: true,
        },
      })

      return projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description || "",
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        managerId: project.managerId,
        manager: project.manager
          ? {
              id: project.manager.id,
              name: project.manager.name,
              email: project.manager.email,
              role: project.manager.role,
            }
          : undefined,
        tasks: project.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
        })),
      }))
    } catch (error) {
      console.error("Error fetching projects from database:", error)
      throw new Error("Failed to fetch projects")
    }
  }

  // Other methods for CRUD operations...
  // Implementation continues...
}

