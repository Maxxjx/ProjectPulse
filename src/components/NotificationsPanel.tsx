'use client';

import { useState, useEffect, useRef } from 'react';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/lib/hooks/useNotifications';
import type { Notification } from '@/lib/hooks/useNotifications';
import Link from 'next/link';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: notifications, isLoading, error } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  
  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
    onClose();
  };
  
  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };
  
  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `${interval} year${interval === 1 ? '' : 's'} ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }
    
    return `${Math.floor(seconds)} second${Math.floor(seconds) === 1 ? '' : 's'} ago`;
  };
  
  // Get notification link based on type
  const getNotificationLink = (notification: Notification) => {
    switch (notification.entityType) {
      case 'task':
        return `/dashboard/tasks/${notification.entityId}`;
      case 'project':
        return `/dashboard/projects/${notification.entityId}`;
      case 'comment':
        return `/dashboard/tasks/${notification.entityId}`;
      case 'team':
        return `/dashboard/team`;
      default:
        return '/dashboard';
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'project_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
        );
      case 'comment_added':
        return (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'budget_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'task_deadline':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'team_updated':
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/30 flex justify-end"
      aria-modal="true"
      role="dialog"
      aria-labelledby="notifications-title"
    >
      <div 
        ref={panelRef}
        id="notifications-panel"
        className="w-full max-w-md h-full bg-[#111827] shadow-xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out transform"
        style={{ maxHeight: '100vh' }}
        tabIndex={-1}
        aria-live="polite"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 id="notifications-title" className="text-lg font-medium">Notifications</h2>
          <div className="flex items-center gap-2">
            {notifications?.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] transition"
                disabled={markAllAsRead.isPending}
                aria-live="polite"
              >
                {markAllAsRead.isPending ? 'Marking...' : 'Mark all as read'}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Close notifications panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="p-4 space-y-4" aria-busy="true" aria-label="Loading notifications">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-700 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500" role="alert">
              Failed to load notifications
            </div>
          ) : notifications?.length === 0 ? (
            <div className="p-4 text-center text-gray-400 flex flex-col items-center justify-center h-full" aria-label="No notifications">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-lg">No notifications</p>
              <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700" role="list" aria-label="Notifications list">
              {notifications?.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification)}
                  className={`block p-4 hover:bg-[#1F2937] active:bg-[#1F2937]/70 transition-colors ${
                    !notification.isRead ? 'bg-[#1F2937]/50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  role="listitem"
                  aria-labelledby={`notification-title-${notification.id}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNotificationClick(notification);
                    }
                  }}
                >
                  <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0" aria-hidden="true">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 
                          id={`notification-title-${notification.id}`}
                          className={`text-sm font-medium truncate ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span 
                            className="inline-block w-2 h-2 bg-[#8B5CF6] rounded-full ml-2 flex-shrink-0" 
                            aria-label="Unread"
                          ></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Bottom action bar - Mobile only */}
        {notifications && notifications.length > 0 && (
          <div className="p-3 border-t border-gray-700 sm:hidden">
            <Link
              href="/dashboard/notifications"
              className="w-full py-2 px-4 bg-[#1F2937] hover:bg-[#283548] rounded-md text-center block"
              onClick={onClose}
            >
              View all notifications
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 