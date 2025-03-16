import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/data/dataService';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Type definitions
interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  startDate: string;
  deadline: string;
  budget?: number;
  spent?: number;
  clientId?: string;
  team: string[];
  tags?: string[];
  priority: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectAssignedUser {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

// Validation schema for creating a project
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  progress: z.number().min(0).max(100),
  startDate: z.string(),
  deadline: z.string(),
  budget: z.number().optional(),
  spent: z.number().optional(),
  clientId: z.string().optional(),
  team: z.array(z.string()),
  tags: z.array(z.string()).optional(),
  priority: z.string(),
});

// GET all projects or filter by query params
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('GET /api/projects request received');
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const teamMemberId = searchParams.get('teamMemberId');
    
    let projectData: ProjectData[] = [];
    
    // Try to get mock projects since we're using mock data for now
    try {
      console.log('Fetching projects with filters:', { clientId, teamMemberId });
      
      if (clientId) {
        // Get projects by client
        projectData = await projectService.getProjectsByClient(clientId);
      } else if (teamMemberId) {
        // Get projects by team member
        projectData = await projectService.getProjectsByTeamMember(teamMemberId);
      } else {
        // Get all projects
        projectData = await projectService.getProjects();
      }
      
      if (projectData && projectData.length > 0) {
        console.log(`Found ${projectData.length} projects`);
        return NextResponse.json(projectData);
      } else {
        console.log('No projects found, returning empty array');
        return NextResponse.json([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json(
        { error: 'Failed to fetch projects', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in projects API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}

// POST to create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Validate the request body
    try {
      const validatedData = createProjectSchema.parse(body);
      
      // Create the project using the mock service
      const creatorId = session.user.id || '1';
      const creatorName = session.user.name || 'Unknown User';
      
      const project = await projectService.createProject(
        validatedData,
        creatorId,
        creatorName
      );
      
      return NextResponse.json({ project }, { status: 201 });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', details: error.message },
      { status: 500 }
    );
  }
}