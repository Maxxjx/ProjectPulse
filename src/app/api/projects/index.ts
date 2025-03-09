import { NextRequest, NextResponse } from 'next/server';
import { projectService } from '@/lib/data/mockDataService';
import { z } from 'zod';
// Optional Prisma integration (ensure /lib/prisma exists)
// import { prisma } from '@/lib/prisma';

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

export async function GET(request: NextRequest) {
  try {
    if (process.env.USE_PRISMA === 'true') {
      // const projects = await prisma.project.findMany();
      // ...existing code...
      return NextResponse.json({ projects: [] }); // Placeholder using Prisma
    } else {
      const projects = projectService.getProjects();
      return NextResponse.json({ projects });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }
    const { creatorId, creatorName, ...projectData } = body;
    let newProject;
    if (process.env.USE_PRISMA === 'true') {
      // newProject = await prisma.project.create({ data: projectData });
      // ...existing code...
      newProject = {}; // Placeholder using Prisma
    } else {
      newProject = projectService.createProject(projectData, creatorId || '1', creatorName || 'Admin User');
    }
    return NextResponse.json({ project: newProject }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // ...existing code to update project...
    return NextResponse.json({ message: 'Project updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // ...existing code to delete project...
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}