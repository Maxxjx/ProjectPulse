'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { TimeEntry } from '@/lib/data/types';

// Mock time entries data as fallback
const mockTimeEntries: TimeEntry[] = [
  {
    id: 1,
    taskId: 1,
    userId: '1',
    description: 'Working on login form validation',
    minutes: 60, // 1 hour
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString().split('T')[0], // 3 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 2,
    taskId: 2,
    userId: '1',
    description: 'Setting up API routes',
    minutes: 120, // 2 hours
    date: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString().split('T')[0], // 8 hours ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
  },
  {
    id: 3,
    taskId: 3,
    userId: '2',
    description: 'Designing database schema',
    minutes: 120, // 2 hours
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString().split('T')[0], // 1 day ago
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
];

// Current active time tracking (not saved to DB yet)
let activeTimeTracking: {
  userId: string;
  taskId: number;
  description: string;
  startTime: Date;
} | null = null;

// Get all time entries for a user
export function useUserTimeEntries(userId?: string) {
  const { data: session } = useSession();
  const currentUserId = userId || session?.user?.id;

  return useQuery({
    queryKey: ['timeEntries', 'user', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];
      
      try {
        const response = await fetch(`/api/time-entries?userId=${currentUserId}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        return data.timeEntries;
      } catch (error) {
        console.warn('Falling back to mock data for time entries:', error);
        // Fallback to mock data
        return mockTimeEntries.filter(entry => entry.userId === currentUserId);
      }
    },
    enabled: !!currentUserId,
  });
}

// Get all time entries for a specific task
export function useTaskTimeEntries(taskId: number) {
  return useQuery({
    queryKey: ['timeEntries', 'task', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      
      try {
        const response = await fetch(`/api/time-entries?taskId=${taskId}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        return data.timeEntries;
      } catch (error) {
        console.warn('Falling back to mock data for task time entries:', error);
        // Fallback to mock data
        return mockTimeEntries.filter(entry => entry.taskId === taskId);
      }
    },
    enabled: !!taskId,
  });
}

// Get time entries within a date range
export function useTimeEntriesInRange(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['timeEntries', 'range', startDate, endDate],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/time-entries?startDate=${startDate}&endDate=${endDate}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        return data.timeEntries;
      } catch (error) {
        console.warn('Falling back to mock data for time entries in range:', error);
        // Fallback to mock data - filter by date range
        return mockTimeEntries.filter(entry => {
          const entryDate = entry.date;
          return entryDate >= startDate && entryDate <= endDate;
        });
      }
    },
    enabled: !!(startDate && endDate),
  });
}

// Start time tracking for a task
export function useStartTimeTracking() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ taskId, description }: { taskId: number, description: string }) => {
      if (!userId) throw new Error('User not authenticated');
      
      try {
        // Start tracking locally first
        activeTimeTracking = {
          userId,
          taskId,
          description,
          startTime: new Date()
        };
        
        // Only notify UI about time tracking starting - actual entry will be created when stopping
        return { success: true, message: 'Time tracking started' };
      } catch (error) {
        console.warn('Error starting time tracking:', error);
        throw new Error('Failed to start time tracking');
      }
    },
    onSuccess: () => {
      // Invalidate active time entry query
      queryClient.invalidateQueries({ queryKey: ['activeTimeEntry'] });
    },
  });
}

// Stop time tracking
export function useStopTimeTracking() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      if (!activeTimeTracking) throw new Error('No active time tracking');
      
      const now = new Date();
      const startTime = activeTimeTracking.startTime;
      const minutesSpent = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
      
      try {
        const response = await fetch('/api/time-entries', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskId: activeTimeTracking.taskId,
            userId: activeTimeTracking.userId,
            description: activeTimeTracking.description,
            minutes: minutesSpent,
            date: startTime.toISOString().split('T')[0]
          }),
        });
        
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        activeTimeTracking = null; // Clear active tracking
        return data.timeEntry;
      } catch (error) {
        console.warn('Falling back to mock for stopping time tracking:', error);
        
        // Create a new time entry from the active tracking (using non-null assertion because we checked above)
        const newEntry: TimeEntry = {
          id: mockTimeEntries.length > 0 ? Math.max(...mockTimeEntries.map(entry => entry.id)) + 1 : 1,
          taskId: activeTimeTracking!.taskId,
          userId: activeTimeTracking!.userId,
          description: activeTimeTracking!.description,
          minutes: minutesSpent,
          date: startTime.toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        };
        
        // Add to mock data
        mockTimeEntries.push(newEntry);
        
        // Clear active tracking
        activeTimeTracking = null;
        
        return newEntry;
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['activeTimeEntry'] });
    },
  });
}

// Delete a time entry
export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (timeEntryId: number) => {
      try {
        const response = await fetch(`/api/time-entries/${timeEntryId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('API error');
        }
        
        return { id: timeEntryId };
      } catch (error) {
        console.warn('Falling back to mock for deleting time entry:', error);
        // Fallback to mock implementation
        const entryIndex = mockTimeEntries.findIndex(entry => entry.id === timeEntryId);
        
        if (entryIndex === -1) {
          throw new Error('Time entry not found');
        }
        
        // Remove from mock data
        mockTimeEntries.splice(entryIndex, 1);
        
        return { id: timeEntryId };
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
    },
  });
}

// Get current active time entry for the user
export function useActiveTimeEntry() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['activeTimeEntry', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        if (activeTimeTracking && activeTimeTracking.userId === userId) {
          const startTime = activeTimeTracking.startTime;
          const now = new Date();
          const minutesSpent = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
          
          return {
            taskId: activeTimeTracking.taskId,
            description: activeTimeTracking.description,
            startTime: startTime.toISOString(),
            elapsedMinutes: minutesSpent,
            isActive: true
          };
        }
        
        // If no local active tracking, check API
        const response = await fetch(`/api/time-entries/active?userId=${userId}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        return data.timeEntry || null;
      } catch (error) {
        console.warn('Falling back to mock for active time entry:', error);
        // Just return the local active tracking data if available
        if (activeTimeTracking && activeTimeTracking.userId === userId) {
          const startTime = activeTimeTracking.startTime;
          const now = new Date();
          const minutesSpent = Math.round((now.getTime() - startTime.getTime()) / (1000 * 60));
          
          return {
            taskId: activeTimeTracking.taskId,
            description: activeTimeTracking.description,
            startTime: startTime.toISOString(),
            elapsedMinutes: minutesSpent,
            isActive: true
          };
        }
        
        return null;
      }
    },
    enabled: !!userId,
    refetchInterval: 60000, // Refetch every minute to update duration
  });
}