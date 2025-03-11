import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/data/dataService';
import { z } from 'zod';

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
    const { searchParams } = new URL(request.url);
    
    const clientId = searchParams.get('clientId');
    const teamMemberId = searchParams.get('teamMemberId');
    
    let projects;
    
    if (clientId) {
      projects = await projectService.getProjectsByClient(clientId);
    } else if (teamMemberId) {
      projects = await projectService.getProjectsByTeamMember(teamMemberId);
    } else {
      projects = await projectService.getProjects();
    }
    
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST to create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = createProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extract user info from request (in a real app, this would come from auth)
    const creatorId = body.creatorId || '1'; // Default to admin if not provided
    const creatorName = body.creatorName || 'Admin User';
    
    const { creatorId: _, creatorName: __, ...projectData } = body;
    
    const newProject = await projectService.createProject(
      projectData,
      creatorId,
      creatorName
    );
    
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 