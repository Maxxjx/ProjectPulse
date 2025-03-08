import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/data/mockDataService';
import { v4 as uuidv4 } from 'uuid';

// Mock data for notifications
const mockNotifications = [
  {
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
    id: uuidv4(),
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
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId query parameter is required' },
        { status: 400 }
      );
    }
    
    const notifications = userId ? mockNotifications.filter(n => n.userId === userId) : mockNotifications;
    
    // Sort by createdAt (newest first)
    const sortedNotifications = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json(sortedNotifications, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH to mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.userId && !body.notificationId) {
      return NextResponse.json(
        { error: 'Either userId or notificationId is required' },
        { status: 400 }
      );
    }
    
    // Mark all notifications as read for a user
    if (body.userId && body.markAllAsRead) {
      for (const notification of mockNotifications) {
        if (notification.userId === body.userId) {
          notification.isRead = true;
        }
      }
      return NextResponse.json(
        { success: true, message: 'All notifications marked as read' },
        { status: 200 }
      );
    } 
    // Mark a single notification as read
    else if (body.notificationId) {
      const notification = mockNotifications.find(n => n.id === body.notificationId);
      
      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      
      notification.isRead = body.isRead !== undefined ? body.isRead : true;
      
      return NextResponse.json(
        { success: true, notification },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in PATCH /api/notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
} 