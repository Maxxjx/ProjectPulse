import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/data/mockDataService';
import { z } from 'zod';

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  priority: z.string(),
  projectId: z.number(),
  project: z.string(),
  assigneeId: z.string().optional(),
  assignee: z.string(),
  deadline: z.string(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

// GET all tasks with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const projectId = searchParams.get('projectId');
    const assigneeId = searchParams.get('assigneeId');
    
    let tasks;
    
    if (projectId) {
      tasks = taskService.getTasksByProject(parseInt(projectId));
    } else if (assigneeId) {
      tasks = taskService.getTasksByAssignee(assigneeId);
    } else {
      tasks = taskService.getTasks();
    }
    
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST to create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = createTaskSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extract user info from request (in a real app, this would come from auth)
    const creatorId = body.creatorId || '1'; // Default to admin if not provided
    const creatorName = body.creatorName || 'Admin User';
    
    const newTask = taskService.createTask(
      {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        projectId: body.projectId,
        project: body.project,
        assigneeId: body.assigneeId,
        assignee: body.assignee,
        deadline: body.deadline,
        estimatedHours: body.estimatedHours,
        actualHours: body.actualHours || 0,
        tags: body.tags || [],
        createdBy: creatorName,
      },
      creatorId,
      creatorName
    );
    
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 