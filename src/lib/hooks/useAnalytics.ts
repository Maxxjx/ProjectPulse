'use client';

import { useQuery } from '@tanstack/react-query';

// GET summary analytics
export function useSummaryAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=summary');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch summary analytics');
      }
      const data = await response.json();
      return data.analytics;
    }
  });
}

// GET project status analytics
export function useProjectStatusAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'project-status'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=project-status');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch project status analytics');
      }
      const data = await response.json();
      return data.analytics;
    }
  });
}

// GET task status analytics
export function useTaskStatusAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'task-status'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=task-status');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch task status analytics');
      }
      const data = await response.json();
      return data.analytics;
    }
  });
}

// GET user tasks analytics
export function useUserTasksAnalytics() {
  return useQuery({
    queryKey: ['analytics', 'user-tasks'],
    queryFn: async () => {
      const response = await fetch('/api/analytics?type=user-tasks');
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch user tasks analytics');
      }
      const data = await response.json();
      return data.analytics;
    }
  });
}

// GET recent activity
export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: ['analytics', 'recent-activity', limit],
    queryFn: async () => {
      const response = await fetch(`/api/analytics?type=recent-activity&limit=${limit}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch recent activity');
      }
      const data = await response.json();
      return data.analytics.activity;
    }
  });
} 