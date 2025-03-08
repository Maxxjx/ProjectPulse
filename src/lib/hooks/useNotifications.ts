'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { 
  getNotifications, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../services/notificationService';

export const useNotifications = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useUnreadNotificationsCount = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useQuery({
    queryKey: ['unreadNotifications', userId],
    queryFn: () => getUnreadNotificationCount(userId),
    enabled: !!userId,
    refetchInterval: 15000, // Refetch every 15 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', userId] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', userId] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: (notificationId: number) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', userId] });
    },
  });
}; 