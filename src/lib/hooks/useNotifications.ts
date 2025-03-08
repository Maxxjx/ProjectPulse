'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// GET user's notifications
export function useNotifications(userId: string) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notifications');
      }
      const data = await response.json();
      return data.notifications;
    },
    enabled: !!userId
  });
}

// PATCH mark notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ notificationId }: { notificationId: number }) => {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark notification as read');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (_, variables) => {
      // Update notifications for the user
      queryClient.invalidateQueries({ 
        queryKey: ['notifications'] 
      });
    }
  });
}

// PATCH mark all notifications as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, markAllAsRead: true }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark all notifications as read');
      }
      
      const data = await response.json();
      return data;
    },
    onSuccess: (_, variables) => {
      // Update notifications for the user
      queryClient.invalidateQueries({ 
        queryKey: ['notifications', variables.userId] 
      });
    }
  });
}

// Calculate unread notifications count
export function useUnreadNotificationsCount(userId: string) {
  const { data: notifications, isLoading, error } = useNotifications(userId);
  
  if (isLoading || error || !notifications) {
    return { count: 0, isLoading, error };
  }
  
  const unreadCount = notifications.filter((notification: any) => !notification.read).length;
  
  return { count: unreadCount, isLoading, error };
} 