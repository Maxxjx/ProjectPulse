'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Project } from '@/lib/data/types';

// GET all projects
export function useProjects(clientId?: string, teamMemberId?: string) {
  const queryParams = new URLSearchParams();
  if (clientId) queryParams.append('clientId', clientId);
  if (teamMemberId) queryParams.append('teamMemberId', teamMemberId);
  
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery({
    queryKey: ['projects', { clientId, teamMemberId }],
    queryFn: async () => {
      const response = await fetch(`/api/projects${queryStr}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch projects');
      }
      const data = await response.json();
      return data.projects;
    }
  });
}

// GET single project
export function useProject(id: number) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch project');
      }
      const data = await response.json();
      return data.project;
    },
    enabled: !!id
  });
}

// POST create project
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { 
      creatorId?: string;
      creatorName?: string;
    }) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create project');
      }
      
      const data = await response.json();
      return data.project;
    },
    onSuccess: () => {
      // Invalidate projects query to refetch
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

// PATCH update project
export function useUpdateProject(id: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: Partial<Project> & {
      updaterId?: string;
      updaterName?: string;
    }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update project');
      }
      
      const data = await response.json();
      return data.project;
    },
    onSuccess: (updatedProject) => {
      // Update cache for the individual project
      queryClient.setQueryData(['projects', id], updatedProject);
      
      // Invalidate projects list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}

// DELETE project
export function useDeleteProject() {
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
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
      }
      
      return { id };
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch projects queries
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.removeQueries({ queryKey: ['projects', variables.id] });
    }
  });
} 