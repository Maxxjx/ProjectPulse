import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/data/mockDataService';
import { z } from 'zod';

// Validation schema for updating a task
const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assigneeId: z.string().optional(),
  assignee: z.string().optional(),
  deadline: z.string().optional(),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

// GET a specific task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const task = taskService.getTaskById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Get comments for this task
    const comments = taskService.getTaskComments(taskId);
    
    return NextResponse.json({ 
      task: {
        ...task,
        comments
      }
    }, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/tasks/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PATCH to update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = updateTaskSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extract user info from request (in a real app, this would come from auth)
    const updaterId = body.updaterId || '1'; // Default to admin if not provided
    const updaterName = body.updaterName || 'Admin User';
    
    const { updaterId: _, updaterName: __, ...taskData } = body;
    
    const updatedTask = taskService.updateTask(
      taskId,
      taskData,
      updaterId,
      updaterName
    );
    
    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ task: updatedTask }, { status: 200 });
  } catch (error) {
    console.error(`Error in PATCH /api/tasks/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    
    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }
    
    // In a real app, we would extract user info from auth
    const deleterId = '1'; // Default to admin
    const deleterName = 'Admin User';
    
    const deleted = taskService.deleteTask(
      taskId,
      deleterId,
      deleterName
    );
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error in DELETE /api/tasks/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 