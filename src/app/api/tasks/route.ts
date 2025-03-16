import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/data/dataService';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Type definitions for tasks
interface TaskData {
  id: string | number;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number | string;
  project?: string;
  assigneeId?: string;
  assignee?: string;
  deadline: string;
  estimatedHours?: number;
  tags?: string[];
  created?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Validation schema for creating a task
const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  status: z.string(),
  priority: z.string(),
  projectId: z.union([z.number(), z.string()]),
  assigneeId: z.string().optional(),
  deadline: z.string(),
  estimatedHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

// Helper function to validate task data
function validateTask(task: any): TaskData | null {
  if (!task) return null;
  
  // Ensure required fields exist
  if (!task.title || typeof task.title !== 'string') {
    console.warn('Invalid task title:', task.title);
    task.title = task.title || 'Untitled Task';
  }
  
  // Ensure status is valid
  if (!task.status) {
    task.status = 'Not Started';
  }
  
  // Ensure priority is valid
  if (!task.priority) {
    task.priority = 'Medium';
  }
  
  // Format dates consistently
  if (task.deadline && typeof task.deadline === 'string') {
    try {
      const dateObj = new Date(task.deadline);
      if (!isNaN(dateObj.getTime())) {
        // Valid date, use it in a consistent format
        task.deadline = dateObj.toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Invalid deadline in task:', task.deadline);
    }
  }
  
  return task as TaskData;
}

// GET all tasks or filter by query params
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('GET /api/tasks request received');
    
    const { searchParams } = new URL(request.url);
    
    const projectId = searchParams.get('projectId');
    const assigneeId = searchParams.get('assigneeId');
    const status = searchParams.get('status');
    
    console.log('Query parameters:', { projectId, assigneeId, status });
    
    let tasks: TaskData[] = [];
    
    try {
      // Get tasks based on filters
      if (projectId) {
        console.log(`Fetching tasks for project ID: ${projectId}`);
        tasks = await taskService.getTasksByProject(Number(projectId));
      } else if (assigneeId) {
        console.log(`Fetching tasks for assignee ID: ${assigneeId}`);
        tasks = await taskService.getTasksByAssignee(assigneeId);
      } else {
        console.log('Fetching all tasks');
        tasks = await taskService.getTasks();
      }
      
      // Filter by status if specified
      if (status && tasks && tasks.length > 0) {
        console.log(`Filtering tasks by status: ${status}`);
        tasks = tasks.filter(task => 
          task.status.toLowerCase() === status.toLowerCase()
        );
      }
      
      // Validate and clean each task
      const validTasks = tasks
        .map(task => validateTask(task))
        .filter(Boolean) as TaskData[];
      
      console.log(`Returning ${validTasks.length} tasks`);
      return NextResponse.json(validTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tasks', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in tasks API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}

// POST to create a new task
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
      const validatedData = createTaskSchema.parse(body);
      
      // Create the task using the mock service
      const creatorId = session.user.id || '1';
      const creatorName = session.user.name || 'Unknown User';
      
      const task = await taskService.createTask(
        validatedData,
        creatorId,
        creatorName
      );
      
      return NextResponse.json(validateTask(task), { status: 201 });
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
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task', details: error.message },
      { status: 500 }
    );
  }
}