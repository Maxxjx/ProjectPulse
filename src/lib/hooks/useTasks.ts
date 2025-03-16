'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task } from '@/lib/data/types';
import { tasks as mockTasks } from '@/lib/data/mockData';

// GET all tasks
export function useTasks(projectId?: number, assigneeId?: string) {
  const queryParams = new URLSearchParams();
  
  if (projectId) queryParams.append('projectId', projectId.toString());
  if (assigneeId) queryParams.append('assigneeId', assigneeId.toString());
  
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery({
    queryKey: ['tasks', { projectId, assigneeId }],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/tasks${queryStr}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        const data = await response.json();
        // API is directly returning the tasks array, not wrapped in a tasks property
        return Array.isArray(data) ? data : (data.tasks || []);
      } catch (error) {
        console.warn('Falling back to mock data for tasks:', error);
        
        // Filter mockTasks based on params if needed
        let filteredTasks = [...mockTasks];
        
        if (projectId) {
          filteredTasks = filteredTasks.filter(t => t.projectId === projectId);
        }
        
        if (assigneeId) {
          filteredTasks = filteredTasks.filter(t => t.assigneeId === assigneeId);
        }
        
        return filteredTasks;
      }
    }
  });
}

// GET single task
export function useTask(id: number) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        const data = await response.json();
        return data.task;
      } catch (error) {
        console.warn(`Falling back to mock data for task ${id}:`, error);
        // Find the task in the mock data
        return mockTasks.find(t => t.id === id);
      }
    },
    enabled: !!id
  });
}

// POST create task
export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'created' | 'updated' | 'comments' | 'attachments'> & {
      creatorId?: string;
      creatorName?: string;
    }) => {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create task');
      }
      
      const data = await response.json();
      return data.task;
    },
    onSuccess: (newTask) => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Also invalidate project-specific tasks
      if (newTask.projectId) {
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', { projectId: newTask.projectId }] 
        });
      }
    }
  });
}

// PATCH update task
export function useUpdateTask(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: Partial<Task> & {
      updaterId?: string;
      updaterName?: string;
    }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update task');
      }
      
      const data = await response.json();
      return data.task;
    },
    onSuccess: (updatedTask) => {
      // Update cache for the individual task
      queryClient.setQueryData(['tasks', id], updatedTask);
      
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      
      // Also invalidate project-specific tasks
      if (updatedTask.projectId) {
        queryClient.invalidateQueries({ 
          queryKey: ['tasks', { projectId: updatedTask.projectId }] 
        });
      }
    }
  });
}

// DELETE task
export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      deleterId = '1', 
      deleterName = 'Admin User' 
    }: { 
      id: number; 
      deleterId?: string; 
      deleterName?: string; 
    }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete task');
      }
      
      return { id };
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch tasks queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.removeQueries({ queryKey: ['tasks', variables.id] });
    }
  });
}

// GET task comments
export function useTaskComments(taskId: number) {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: async () => {
      const response = await fetch(`/api/tasks/${taskId}/comments`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch comments');
      }
      const data = await response.json();
      return data.comments;
    },
    enabled: !!taskId
  });
}

// POST add comment to task
export function useAddComment(taskId: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      text, 
      userId = '1', 
      userName = 'Admin User' 
    }: { 
      text: string; 
      userId?: string; 
      userName?: string; 
    }) => {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, userId, userName }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add comment');
      }
      
      const data = await response.json();
      return data.comment;
    },
    onSuccess: () => {
      // Invalidate comments for this task
      queryClient.invalidateQueries({ 
        queryKey: ['tasks', taskId, 'comments'] 
      });
      
      // Also update the task itself since it might include comments
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    }
  });
} 