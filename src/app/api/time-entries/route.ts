import { NextRequest, NextResponse } from 'next/server';
import { timeEntryService } from '@/lib/data/mockDataService';
import { z } from 'zod';

// Validation schema for creating a time entry
const createTimeEntrySchema = z.object({
  taskId: z.number(),
  userId: z.string(),
  description: z.string().min(1, 'Description is required'),
  minutes: z.number().min(1, 'Minutes must be at least 1'),
  date: z.string(),
});

// GET all time entries or filter by query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const taskId = searchParams.get('taskId');
    const userId = searchParams.get('userId');
    
    let timeEntries;
    
    if (taskId && userId) {
      timeEntries = timeEntryService.getTimeEntriesByTaskAndUser(
        parseInt(taskId), 
        userId
      );
    } else if (taskId) {
      timeEntries = timeEntryService.getTimeEntriesByTask(parseInt(taskId));
    } else if (userId) {
      timeEntries = timeEntryService.getTimeEntriesByUser(userId);
    } else {
      timeEntries = timeEntryService.getTimeEntries();
    }
    
    return NextResponse.json({ timeEntries }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/time-entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time entries' },
      { status: 500 }
    );
  }
}

// POST to create a new time entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = createTimeEntrySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const newTimeEntry = timeEntryService.createTimeEntry(body);
    
    return NextResponse.json({ timeEntry: newTimeEntry }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/time-entries:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry' },
      { status: 500 }
    );
  }
}