import { NextResponse } from "next/server"
import { dataService } from "@/lib/data-service"
import { MockDataService } from "@/lib/data/mockDataService"

// Create a mock service instance for fallback
const mockService = new MockDataService()

export async function GET() {
  try {
    // Attempt to get projects using the configured data service
    const projects = await dataService.getProjects()
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)

    try {
      // Fallback to mock data if the primary data service fails
      console.log("Falling back to mock data for projects")
      const mockProjects = await mockService.getProjects()

      // Return mock data with a header indicating it's fallback data
      return NextResponse.json(mockProjects, {
        status: 200,
        headers: {
          "X-Data-Source": "mock",
        },
      })
    } catch (fallbackError) {
      // If even the fallback fails, return an error
      console.error("Fallback to mock data failed:", fallbackError)
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
    }
  }
}

export async function POST(request: Request) {
  try {
    const projectData = await request.json()
    const newProject = await dataService.createProject(projectData)
    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)

    try {
      // Fallback to mock data for creation
      console.log("Falling back to mock data for project creation")
      const projectData = await request.json() // Declare projectData here
      const mockProject = await mockService.createProject(projectData)

      return NextResponse.json(mockProject, {
        status: 201,
        headers: {
          "X-Data-Source": "mock",
        },
      })
    } catch (fallbackError) {
      console.error("Fallback to mock data failed:", fallbackError)
      return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
  }
}

