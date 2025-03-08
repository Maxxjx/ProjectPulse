import { NextRequest, NextResponse } from 'next/server';
import { taskService } from '@/lib/data/mockDataService';
import { z } from 'zod';

// Validation schema for creating a comment
const createCommentSchema = z.object({
  text: z.string().min(1, 'Comment text is required'),
});

// GET comments for a specific task
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
    
    const comments = taskService.getTaskComments(taskId);
    
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/tasks/${params.id}/comments:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST to add a comment to a task
export async function POST(
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
    const validationResult = createCommentSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Extract user info from request (in a real app, this would come from auth)
    const userId = body.userId || '1'; // Default to admin if not provided
    const userName = body.userName || 'Admin User';
    
    const newComment = taskService.addComment(
      taskId,
      userId,
      userName,
      body.text
    );
    
    if (!newComment) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error(`Error in POST /api/tasks/${params.id}/comments:`, error);
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    );
  }
} 