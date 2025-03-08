'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { DashboardWidget, WidgetType } from '../data/types';
import { 
  getUserDashboardConfig, 
  updateUserDashboardConfig,
  addWidget,
  removeWidget,
  updateWidgetPositions,
  updateWidgetSettings,
  resetDashboard
} from '../services/widgetService';

// Get user's dashboard widgets
export const useDashboardWidgets = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;
  const userRole = session?.user?.role || '';

  return useQuery({
    queryKey: ['dashboardWidgets', userId],
    queryFn: () => getUserDashboardConfig(userId, userRole),
    enabled: !!userId && !!userRole,
  });
};

// Add a widget to dashboard
export const useAddWidget = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: ({ 
      widgetType, 
      title, 
      size 
    }: { 
      widgetType: WidgetType; 
      title?: string; 
      size?: 'small' | 'medium' | 'large' 
    }) => 
      addWidget(userId, widgetType, title, size),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWidgets', userId] });
    },
  });
};

// Remove a widget from dashboard
export const useRemoveWidget = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: (widgetId: string) => removeWidget(userId, widgetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWidgets', userId] });
    },
  });
};

// Update widget positions
export const useUpdateWidgetPositions = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: (positions: { id: string; position: number }[]) => 
      updateWidgetPositions(userId, positions),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWidgets', userId] });
    },
  });
};

// Update widget settings
export const useUpdateWidgetSettings = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;

  return useMutation({
    mutationFn: ({ 
      widgetId, 
      settings 
    }: { 
      widgetId: string; 
      settings: Record<string, any> 
    }) => 
      updateWidgetSettings(userId, widgetId, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWidgets', userId] });
    },
  });
};

// Reset dashboard to default
export const useResetDashboard = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : 0;
  const userRole = session?.user?.role || '';

  return useMutation({
    mutationFn: () => resetDashboard(userId, userRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardWidgets', userId] });
    },
  });
}; 