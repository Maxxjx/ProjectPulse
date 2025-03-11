import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/data/dataService';
import { z } from 'zod';

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  priority: z.string(),
  projectId: z.number(),
  assigneeId: z.string().optional(),
  deadline: z.string(),
  estimatedHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

// GET all tasks or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const projectId = searchParams.get('projectId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status');
    
    let tasks;
    
    if (projectId) {
      tasks = await taskService.getTasksByProject(parseInt(projectId));
    } else if (assigneeId) {
      tasks = await taskService.getTasksByAssignee(assigneeId);
    } else if (status) {
      tasks = await taskService.getTasksByStatus(status);
    } else {
      tasks = await taskService.getTasks();
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
    
    const { creatorId: _, ...taskData } = body;
    
    const newTask = await taskService.createTask(taskData, creatorId);
    
    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/tasks:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 