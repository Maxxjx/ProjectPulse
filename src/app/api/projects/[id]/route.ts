import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/data/mockDataService';
import { z } from 'zod';

// Validation schema for updating a project
const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.number().optional(),
  spent: z.number().optional(),
  clientId: z.string().optional(),
  team: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  priority: z.string().optional(),
});

// GET a specific project by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const project = projectService.getProjectById(projectId);
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PATCH to update a project
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = updateProjectSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extract user info from request (in a real app, this would come from auth)
    const updaterId = body.updaterId || '1'; // Default to admin if not provided
    const updaterName = body.updaterName || 'Admin User';
    
    const { updaterId: _, updaterName: __, ...projectData } = body;
    
    const updatedProject = projectService.updateProject(
      projectId,
      projectData,
      updaterId,
      updaterName
    );
    
    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ project: updatedProject }, { status: 200 });
  } catch (error) {
    console.error(`Error in PATCH /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }
    
    // In a real app, we would extract user info from auth
    const deleterId = '1'; // Default to admin
    const deleterName = 'Admin User';
    
    const deleted = projectService.deleteProject(
      projectId,
      deleterId,
      deleterName
    );
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in DELETE /api/projects/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 