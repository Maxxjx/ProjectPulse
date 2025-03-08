import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { v4 as uuidv4 } from 'uuid';

// Time entry interface
export interface TimeEntry {
  id: string;
  taskId: number;
  userId: string;
  description: string;
  startTime: string;
  endTime: string | null;
  duration: number | null; // in seconds
  createdAt: string;
  updatedAt: string;
}

// Mock time entries data
let mockTimeEntries: TimeEntry[] = [
  {
    id: uuidv4(),
    taskId: 1,
    userId: '1',
    description: 'Working on login form validation',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    duration: 3600, // 1 hour
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: uuidv4(),
    taskId: 2,
    userId: '1',
    description: 'Setting up API routes',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    duration: 7200, // 2 hours
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: uuidv4(),
    taskId: 3,
    userId: '2',
    description: 'Designing database schema',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
    duration: 7200, // 2 hours
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
  }
];

// Get all time entries for a user
export function useUserTimeEntries() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['timeEntries', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockTimeEntries.filter(entry => entry.userId === userId);
    },
    enabled: !!userId,
  });
}

// Get all time entries for a specific task
export function useTaskTimeEntries(taskId: number) {
  return useQuery({
    queryKey: ['timeEntries', 'task', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockTimeEntries.filter(entry => entry.taskId === taskId);
    },
    enabled: !!taskId,
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if there's already an active time entry for this user
      const activeEntry = mockTimeEntries.find(entry => entry.userId === userId && entry.endTime === null);
      
      if (activeEntry) {
        throw new Error('You already have an active time entry');
      }
      
      // Create new time entry
      const newEntry: TimeEntry = {
        id: uuidv4(),
        taskId,
        userId,
        description,
        startTime: new Date().toISOString(),
        endTime: null,
        duration: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mock data
      mockTimeEntries = [...mockTimeEntries, newEntry];
      
      return newEntry;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find active time entry
      const activeEntryIndex = mockTimeEntries.findIndex(entry => entry.userId === userId && entry.endTime === null);
      
      if (activeEntryIndex === -1) {
        throw new Error('No active time entry found');
      }
      
      const now = new Date();
      const startTime = new Date(mockTimeEntries[activeEntryIndex].startTime);
      const durationInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      
      // Update the entry
      const updatedEntry: TimeEntry = {
        ...mockTimeEntries[activeEntryIndex],
        endTime: now.toISOString(),
        duration: durationInSeconds,
        updatedAt: now.toISOString()
      };
      
      // Update in mock data
      mockTimeEntries = [
        ...mockTimeEntries.slice(0, activeEntryIndex),
        updatedEntry,
        ...mockTimeEntries.slice(activeEntryIndex + 1)
      ];
      
      return updatedEntry;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] });
      queryClient.invalidateQueries({ queryKey: ['activeTimeEntry'] });
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const activeEntry = mockTimeEntries.find(entry => entry.userId === userId && entry.endTime === null);
      return activeEntry || null;
    },
    enabled: !!userId,
    refetchInterval: 1000, // Refetch every second to update timer
  });
}

// Format duration in seconds to human-readable format
export const formatDuration = (durationInSeconds: number | null): string => {
  if (durationInSeconds === null) return '00:00:00';
  
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;
  
  return [hours, minutes, seconds]
    .map(val => val.toString().padStart(2, '0'))
    .join(':');
}; 