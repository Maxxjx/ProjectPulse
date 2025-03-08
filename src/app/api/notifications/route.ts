import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/data/mockDataService';

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
    
    const notifications = notificationService.getUserNotifications(userId);
    
    return NextResponse.json({ notifications }, { status: 200 });
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
      const result = notificationService.markAllAsRead(body.userId);
      return NextResponse.json(
        { success: result, message: 'All notifications marked as read' },
        { status: 200 }
      );
    } 
    // Mark a single notification as read
    else if (body.notificationId) {
      const result = notificationService.markAsRead(body.notificationId);
      if (!result) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: true, message: 'Notification marked as read' },
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