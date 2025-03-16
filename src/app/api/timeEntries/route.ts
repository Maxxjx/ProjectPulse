import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Function to create date for time entries (days ago)
const getDateDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Function to create timestamp for time entries (days ago)
const getTimestampDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

// Mock time entries data with more comprehensive entries across different projects, tasks, and days
const mockTimeEntries = [
  // Today's entries
  {
    id: 1,
    taskId: 1,
    projectId: 1,
    userId: '1',  // Admin user
    description: 'Working on login form validation',
    minutes: 60,
    date: getDateDaysAgo(0),
    createdAt: getTimestampDaysAgo(0)
  },
  {
    id: 2,
    taskId: 2,
    projectId: 1,
    userId: '2',  // Team member
    description: 'Setting up API routes',
    minutes: 120,
    date: getDateDaysAgo(0),
    createdAt: getTimestampDaysAgo(0)
  },
  // Yesterday's entries
  {
    id: 3,
    taskId: 3,
    projectId: 2,
    userId: '3',  // Client
    description: 'Client review meeting',
    minutes: 45,
    date: getDateDaysAgo(1),
    createdAt: getTimestampDaysAgo(1)
  },
  {
    id: 4,
    taskId: 1,
    projectId: 1,
    userId: '1',
    description: 'Bug fixing in auth module',
    minutes: 90,
    date: getDateDaysAgo(1),
    createdAt: getTimestampDaysAgo(1)
  },
  // 2 days ago
  {
    id: 5,
    taskId: 4,
    projectId: 3,
    userId: '2',
    description: 'Database schema design',
    minutes: 180,
    date: getDateDaysAgo(2),
    createdAt: getTimestampDaysAgo(2)
  },
  // 3 days ago
  {
    id: 6,
    taskId: 5,
    projectId: 2,
    userId: '1',
    description: 'Front-end component development',
    minutes: 150,
    date: getDateDaysAgo(3),
    createdAt: getTimestampDaysAgo(3)
  },
  // 4 days ago
  {
    id: 7,
    taskId: 6,
    projectId: 3,
    userId: '3',
    description: 'Requirements gathering',
    minutes: 120,
    date: getDateDaysAgo(4),
    createdAt: getTimestampDaysAgo(4)
  },
  // 5 days ago
  {
    id: 8,
    taskId: 7,
    projectId: 1,
    userId: '2',
    description: 'API documentation',
    minutes: 60,
    date: getDateDaysAgo(5),
    createdAt: getTimestampDaysAgo(5)
  },
  // 6 days ago
  {
    id: 9,
    taskId: 8,
    projectId: 2,
    userId: '1',
    description: 'Unit test development',
    minutes: 240,
    date: getDateDaysAgo(6),
    createdAt: getTimestampDaysAgo(6)
  },
  // Additional entries with task references
  {
    id: 10,
    taskId: 1,
    task: { projectId: 1, title: 'Auth Module', status: 'IN_PROGRESS' },
    userId: '1',
    description: 'Refining user authentication flow',
    minutes: 75,
    date: getDateDaysAgo(2),
    createdAt: getTimestampDaysAgo(2)
  },
  {
    id: 11,
    taskId: 2,
    task: { projectId: 1, title: 'API Setup', status: 'COMPLETED' },
    userId: '2',
    description: 'Finalizing API architecture',
    minutes: 90,
    date: getDateDaysAgo(1),
    createdAt: getTimestampDaysAgo(1)
  }
];

// GET all time entries with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');
    const projectId = searchParams.get('projectId');

    // Apply filters if provided
    let filteredEntries = [...mockTimeEntries];

    if (startDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date >= startDate);
    }

    if (endDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date <= endDate);
    }

    if (userId) {
      filteredEntries = filteredEntries.filter(entry => entry.userId === userId);
    }

    if (projectId) {
      filteredEntries = filteredEntries.filter(entry => {
        // Check direct projectId or projectId in task relation
        return entry.projectId === Number(projectId) || 
               (entry.task && entry.task.projectId === Number(projectId));
      });
    }

    // Add project references to entries for easier data visualization
    const entriesWithReferences = filteredEntries.map(entry => {
      // If entry doesn't have a task object but has a taskId, fake one for demonstration
      if (!entry.task && entry.taskId && !entry.projectId) {
        return {
          ...entry,
          task: { 
            projectId: Math.floor(entry.taskId / 2) + 1, // Simple algorithm to assign projectId
            status: ['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'][Math.floor(Math.random() * 4)] // Random status
          }
        };
      }
      return entry;
    });
  
    // Here you would typically fetch from a database
    return NextResponse.json({ timeEntries: entriesWithReferences }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/timeEntries:', error);
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 });
  }
}
