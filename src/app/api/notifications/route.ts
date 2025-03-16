import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/data/dataService';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Type definitions
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  entityId?: string | number;
  entityType?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

// Validation schema for updating notifications
const updateNotificationSchema = z.object({
  ids: z.array(z.string()),
  isRead: z.boolean()
});

// Helper function to validate notification data
function validateNotification(notification: any): Notification | null {
  if (!notification) return null;
  
  // Ensure required fields exist
  if (!notification.id || !notification.userId || !notification.title || !notification.message) {
    console.warn('Missing required fields in notification:', notification);
    return null;
  }
  
  // Ensure isRead is a boolean
  if (typeof notification.isRead !== 'boolean') {
    notification.isRead = false;
  }
  
  // Format createdAt consistently
  if (notification.createdAt) {
    try {
      if (notification.createdAt instanceof Date) {
        notification.createdAt = notification.createdAt.toISOString();
      } else if (typeof notification.createdAt === 'string') {
        // Validate that it's a proper date string
        const dateObj = new Date(notification.createdAt);
        if (isNaN(dateObj.getTime())) {
          notification.createdAt = new Date().toISOString();
        }
      } else {
        notification.createdAt = new Date().toISOString();
      }
    } catch (error) {
      console.warn('Invalid createdAt in notification:', notification.createdAt);
      notification.createdAt = new Date().toISOString();
    }
  } else {
    notification.createdAt = new Date().toISOString();
  }
  
  return notification as Notification;
}

// Mock data for notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Task assigned to you',
    message: 'You have been assigned the task "Implement Login Page"',
    type: 'task_assigned',
    isRead: false,
    entityId: 1,
    entityType: 'task',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: '2',
    userId: '1',
    title: 'Project status updated',
    message: 'The project "Website Redesign" status has been updated to "In Progress"',
    type: 'project_updated',
    isRead: false,
    entityId: 1,
    entityType: 'project',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    userId: '1',
    title: 'Comment on your task',
    message: 'Michael Chen commented on "Implement Login Page"',
    type: 'comment_added',
    isRead: true,
    entityId: 1,
    entityType: 'comment',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: '4',
    userId: '1',
    title: 'Budget updated',
    message: 'The budget for "Website Redesign" has been updated',
    type: 'budget_updated',
    isRead: true,
    entityId: 1,
    entityType: 'project',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '5',
    userId: '1',
    title: 'Task deadline approaching',
    message: 'The task "Design Navigation" is due in 2 days',
    type: 'task_deadline',
    isRead: true,
    entityId: 2,
    entityType: 'task',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '6',
    userId: '2',
    title: 'New team member added',
    message: 'Emily Johnson has been added to your team',
    type: 'team_updated',
    isRead: false,
    entityId: 1,
    entityType: 'team',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
  },
];

// GET notifications for a user
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }
    
    // Verify the user is requesting their own notifications or is an admin
    const isAdmin = session.user.role === 'ADMIN';
    const isOwnNotifications = session.user.id === userId;
    
    if (!isAdmin && !isOwnNotifications) {
      return NextResponse.json(
        { error: 'You are not authorized to view these notifications' },
        { status: 403 }
      );
    }
    
    try {
      console.log(`Fetching notifications for user: ${userId}`);
      
      // Try to get notifications from the service
      let notifications: Notification[] = await notificationService.getNotificationsByUserId(userId);
      
      // If service fails, use mock data as a fallback
      if (!notifications) {
        console.log('Using mock notification data for user:', userId);
        notifications = mockNotifications.filter((n: Notification) => n.userId === userId);
      }
      
      // Filter for unread only if requested
      if (unreadOnly && notifications.length > 0) {
        notifications = notifications.filter((notification: Notification) => !notification.isRead);
      }
      
      // Validate and clean each notification
      const validNotifications = notifications
        .map(notification => validateNotification(notification))
        .filter(Boolean) as Notification[];
      
      // Sort by createdAt (newest first)
      const sortedNotifications = [...validNotifications].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
      
      // Apply limit if specified
      const result = limit ? sortedNotifications.slice(0, limit) : sortedNotifications;
      
      // Get count of unread notifications
      const unreadCount = validNotifications.filter(n => !n.isRead).length;
      
      console.log(`Returning ${result.length} notifications, ${unreadCount} unread`);
      return NextResponse.json({
        notifications: result,
        count: result.length,
        unreadCount
      });
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications', details: error?.message || 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in notifications API:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

// PATCH to mark notifications as read
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    try {
      const { ids, isRead } = updateNotificationSchema.parse(body);
      
      if (!ids.length) {
        return NextResponse.json(
          { error: 'No notification IDs provided' },
          { status: 400 }
        );
      }
      
      // Verify the user owns these notifications or is an admin
      const isAdmin = session.user.role === 'ADMIN';
      
      if (!isAdmin) {
        // Get the notifications to verify ownership
        const notifications = await Promise.all(
          ids.map(id => notificationService.getNotificationById(id))
        );
        
        // Filter out any null responses (notifications not found)
        const foundNotifications = notifications.filter(Boolean) as Notification[];
        
        // Check if all notifications belong to the user
        const allBelongToUser = foundNotifications.every(n => n.userId === session.user.id);
        
        if (!allBelongToUser) {
          return NextResponse.json(
            { error: 'You are not authorized to update some of these notifications' },
            { status: 403 }
          );
        }
      }
      
      // Update the notifications
      let updatedNotifications: Notification[] = await notificationService.updateNotifications(ids, isRead);
      
      // If service fails, use mock data as a fallback
      if (!updatedNotifications) {
        console.log('Using mock notification data for update');
        updatedNotifications = mockNotifications.filter((n: Notification) => ids.includes(n.id));
        updatedNotifications.forEach((n: Notification) => n.isRead = isRead);
      }
      
      // Validate the updated notifications
      const validNotifications = updatedNotifications
        .map(notification => validateNotification(notification))
        .filter(Boolean) as Notification[];
      
      return NextResponse.json({
        success: true,
        count: validNotifications.length,
        notifications: validNotifications
      });
    } catch (validationError: any) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation error', details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error: any) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}