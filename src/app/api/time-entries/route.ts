import { NextRequest, NextResponse } from 'next/server';
import { timeEntryService } from '@/lib/data/mockDataService';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Validation schema for creating a time entry
const timeEntrySchema = z.object({
  date: z.string(),
  hours: z.number().min(0.1).max(24),
  description: z.string().min(1).max(500),
  userId: z.string().optional(),
  projectId: z.string(),
  taskId: z.string().optional(),
});

// GET all time entries or filter by query params
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Check if we should use the database
    const useDb = process.env.USE_DATABASE === 'true';
    
    if (useDb) {
      // Get time entries from the database
      const timeEntries = await db.timeEntry.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
            },
          },
          task: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });
      
      return NextResponse.json(timeEntries);
    } else {
      // Get time entries from the mock service
      const userId = searchParams.get('userId');
      const projectId = searchParams.get('projectId');
      const taskId = searchParams.get('taskId');
      
      const timeEntries = timeEntryService.getTimeEntries({
        userId: userId || undefined,
        projectId: projectId || undefined,
        taskId: taskId || undefined,
      });
      
      return NextResponse.json({ timeEntries }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch time entries' }),
      { status: 500 }
    );
  }
}

// POST to create a new time entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = timeEntrySchema.parse(body);
    
    // Check if we should use the database
    const useDb = process.env.USE_DATABASE === 'true';
    
    if (useDb) {
      // Create time entry in the database
      const timeEntry = await db.timeEntry.create({
        data: {
          date: new Date(validatedData.date),
          hours: validatedData.hours,
          description: validatedData.description,
          userId: validatedData.userId || session.user.id,
          projectId: validatedData.projectId,
          taskId: validatedData.taskId,
        },
      });
      
      return NextResponse.json(timeEntry, { status: 201 });
    } else {
      // Create time entry using the mock service
      const timeEntry = timeEntryService.createTimeEntry({
        date: validatedData.date,
        hours: validatedData.hours,
        description: validatedData.description,
        userId: validatedData.userId || 'current-user-id',
        projectId: validatedData.projectId,
        taskId: validatedData.taskId,
      });
      
      return NextResponse.json({ timeEntry }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error in POST /api/time-entries:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}