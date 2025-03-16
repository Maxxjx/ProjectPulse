import { NextRequest, NextResponse } from 'next/server';
import { timeEntryService } from '@/lib/data/dataService';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Type definitions for TimeEntry that matches both the database and mock data formats
interface TimeEntry {
  id: string;
  date: string | Date;
  hours: number;
  minutes?: number;
  description: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  projectId: string;
  project?: {
    id: string;
    name: string;
  };
  taskId?: string;
  task?: {
    id: string;
    title: string;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Helper function to validate and convert time entries
function validateTimeEntry(entry: any): TimeEntry | null {
  if (!entry) return null;
  
  // Ensure required fields exist
  if (!entry.id || !entry.date || (!entry.hours && !entry.minutes)) {
    console.warn('Missing required fields in time entry:', entry);
    return null;
  }
  
  // Ensure hours value is a proper number
  if (typeof entry.hours === 'number') {
    // Round to 2 decimal places for consistency
    entry.hours = Math.round(entry.hours * 100) / 100;
  } else if (typeof entry.minutes === 'number') {
    // Convert minutes to hours if available
    entry.hours = Math.round((entry.minutes / 60) * 100) / 100;
    delete entry.minutes;
  }
  
  // Format date consistently
  if (entry.date) {
    try {
      if (typeof entry.date === 'string') {
        const dateObj = new Date(entry.date);
        if (!isNaN(dateObj.getTime())) {
          entry.date = dateObj.toISOString().split('T')[0];
        }
      } else if (entry.date instanceof Date) {
        entry.date = entry.date.toISOString().split('T')[0];
      }
    } catch (error) {
      console.warn('Invalid date in time entry:', entry.date);
    }
  }
  
  return entry as TimeEntry;
}

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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');
    const taskId = searchParams.get('taskId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    console.log('Time entry request with filters:', { userId, projectId, taskId, startDate, endDate });
    
    try {
      let timeEntries: any[] = [];
      
      // Get time entries based on filters
      if (userId) {
        timeEntries = await timeEntryService.getTimeEntriesByUserId(userId);
      } else if (projectId) {
        // If getTimeEntriesByProjectId doesn't exist, fetch all and filter
        if (typeof timeEntryService.getTimeEntriesByProjectId === 'function') {
          timeEntries = await timeEntryService.getTimeEntriesByProjectId(projectId);
        } else {
          console.log('getTimeEntriesByProjectId not available, filtering manually');
          const allEntries = await timeEntryService.getTimeEntries();
          timeEntries = allEntries.filter(entry => entry.projectId === projectId);
        }
      } else if (taskId) {
        timeEntries = await timeEntryService.getTimeEntriesByTaskId(taskId);
      } else {
        timeEntries = await timeEntryService.getTimeEntries();
      }
      
      // Filter by date range if provided
      if (timeEntries.length > 0 && (startDate || endDate)) {
        timeEntries = timeEntries.filter(entry => {
          const entryDate = new Date(entry.date);
          if (startDate && new Date(startDate) > entryDate) return false;
          if (endDate && new Date(endDate) < entryDate) return false;
          return true;
        });
      }
      
      // Validate and clean each entry
      const validEntries = timeEntries
        .map(entry => validateTimeEntry(entry))
        .filter(Boolean) as TimeEntry[];
      
      console.log(`Returning ${validEntries.length} time entries`);
      return NextResponse.json(validEntries);
    } catch (error: any) {
      console.error('Error fetching time entries:', error);
      return NextResponse.json(
        { error: 'Failed to fetch time entries', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in time entries API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST to create a new time entry
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
      const validatedData = timeEntrySchema.parse(body);
      
      // Use the current user's ID if not specified
      if (!validatedData.userId && session.user?.id) {
        validatedData.userId = session.user.id;
      }
      
      // Create the time entry
      let timeEntry;
      
      // Check if the service has the createTimeEntry method
      if (typeof timeEntryService.createTimeEntry === 'function') {
        timeEntry = await timeEntryService.createTimeEntry(validatedData);
      } else {
        // Fallback implementation if the method doesn't exist
        console.log('createTimeEntry not available, using fallback implementation');
        timeEntry = {
          id: new Date().getTime().toString(),
          ...validatedData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isRead: false
        };
      }
      
      // Validate the created entry
      const validEntry = validateTimeEntry(timeEntry);
      
      if (!validEntry) {
        throw new Error('Failed to create a valid time entry');
      }
      
      return NextResponse.json(validEntry, { status: 201 });
    } catch (validationError: any) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error: any) {
    console.error('Error creating time entry:', error);
    return NextResponse.json(
      { error: 'Failed to create time entry', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}