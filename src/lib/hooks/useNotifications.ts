'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '@/lib/data/dataService';

// Mock notifications for fallback
const mockNotifications = [
  {
    id: '1',
    userId: '1',
    title: 'Task assigned',
    message: 'You have been assigned to a new task "Update homepage design"',
    type: 'task',
    isRead: false,
    entityId: 3,
    entityType: 'task',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
  },
  {
    id: '2',
    userId: '1',
    title: 'Comment on your task',
    message: 'John commented on task "API Integration"',
    type: 'comment',
    isRead: true,
    entityId: 2,
    entityType: 'task',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() // 3 hours ago
  },
  {
    id: '3',
    userId: '1',
    title: 'Project deadline approaching',
    message: 'Project "Website Redesign" is due in 2 days',
    type: 'deadline',
    isRead: false,
    entityId: 1,
    entityType: 'project',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  }
];

// Define the Notification type
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  entityId: number;
  entityType: string;
  createdAt: string;
}

// Fetch notifications for the current user
export function useNotifications() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return { data: [] };
      
      try {
        const response = await fetch(`/api/notifications?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }
        
        const data = await response.json();
        return { data: Array.isArray(data) ? data : data.notifications || [] };
      } catch (error) {
        console.warn('Falling back to mock notifications data:', error);
        // Filter mock notifications for the current user
        return { 
          data: userId ? mockNotifications.filter(n => n.userId === userId) : [] 
        };
      }
    },
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds to get new notifications
    refetchOnWindowFocus: true,
  });
}

// Mark a notification as read
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isRead: true }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to mark notification as read');
        }
        
        return response.json();
      } catch (error) {
        console.warn('Falling back to mock implementation for mark as read:', error);
        // Return a mock success response
        return { success: true, id: notificationId };
      }
    },
    onSuccess: () => {
      // Invalidate the notifications query to refetch
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      }
    },
  });
}

// Mark all notifications as read
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async () => {
      try {
        if (!userId) throw new Error('No user ID');
        
        const response = await fetch(`/api/notifications/mark-all-read`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to mark all notifications as read');
        }
        
        return response.json();
      } catch (error) {
        console.warn('Falling back to mock implementation for mark all as read:', error);
        // Return a mock success response
        return { success: true };
      }
    },
    onSuccess: () => {
      // Invalidate the notifications query to refetch
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      }
    },
  });
}

// Get the count of unread notifications
export function useUnreadNotificationsCount() {
  const { data: notifications, isLoading, error } = useNotifications();
  
  // Make sure we have an array before calling filter
  const unreadCount = Array.isArray(notifications?.data) 
    ? notifications.data.filter(notification => !notification.isRead).length 
    : 0;
  
  return {
    unreadCount,
    isLoading,
    error,
  };
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete notification');
        }

        return response.json();
      } catch (error) {
        console.warn('Falling back to mock implementation for delete notification:', error);
        // Return a mock success response
        return { success: true, id: notificationId };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId.toString()] });
    },
  });
};