'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUnreadNotificationsCount } from '@/lib/hooks/useNotifications';
import NotificationDropdown from '@/components/NotificationDropdown';

// Icons
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const ProjectsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
  </svg>
);

const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const NotificationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Add Budget Icon
const BudgetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
  </svg>
);

const TicketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a1 1 0 000 2h2a1 1 0 100-2H10z" />
    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
  </svg>
);

// Add Reports Icon
const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: unreadCount = 0, isLoading: isLoadingNotifications } = useUnreadNotificationsCount();

  // Define navigation items based on user role
  const getNavItems = (role?: string) => {
    const items = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: <HomeIcon />,
        roles: ['admin', 'team', 'client', 'user'],
      },
      {
        name: 'Projects',
        href: '/dashboard/projects',
        icon: <ProjectsIcon />,
        roles: ['admin', 'team', 'client', 'user'],
      },
      {
        name: 'Tasks',
        href: '/dashboard/tasks',
        icon: <TasksIcon />,
        roles: ['admin', 'team', 'client', 'user'],
      },
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: <AnalyticsIcon />,
        roles: ['admin', 'team'],
      },
      {
        name: 'Budget',
        href: '/dashboard/budget',
        icon: <BudgetIcon />,
        roles: ['admin', 'client'],
      },
      {
        name: 'Tickets',
        href: '/dashboard/tickets',
        icon: <TicketIcon />,
        roles: ['admin', 'client', 'team'],
      },
      {
        name: 'Users',
        href: '/dashboard/users',
        icon: <UsersIcon />,
        roles: ['admin'],
      },
      {
        name: 'Reports',
        href: '/dashboard/reports',
        icon: <ReportsIcon />,
        roles: ['admin', 'team', 'client', 'user'],
      },
    ];

    return items.filter(item => 
      item.roles.includes(role || '') || 
      (role === 'admin') // Admin can access everything
    );
  };

  // Filter navigation items based on user role
  const navItems = getNavItems(session?.user?.role);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1F2937] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F2937] text-white flex">
      {/* Sidebar (collapsible) */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#111827] transition-all duration-300 fixed inset-y-0 z-50 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-8 h-8 bg-[#8B5CF6] rounded-md flex items-center justify-center">
              <span className="font-bold text-white">P</span>
            </div>
            {sidebarOpen && (
              <span className="ml-2 font-semibold text-lg">ProjectPulse</span>
            )}
          </div>
          {sidebarOpen ? (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
              title="Collapse sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white absolute right-2"
              title="Expand sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md 
                    ${pathname === item.href ? 'bg-[#8B5CF6] text-white' : 'text-gray-300 hover:bg-gray-700'}
                    ${!sidebarOpen && 'justify-center'}
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Info */}
        <div className="p-4 border-t border-gray-700">
          <div className={`flex ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-[#8B5CF6] flex items-center justify-center">
              {session?.user?.name?.charAt(0) || 'U'}
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-400 truncate capitalize">{session?.user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="bg-[#111827] shadow-md sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white md:hidden"
            >
              <MenuIcon />
            </button>
            
            <div className="flex-1">
              {session?.user?.role === 'admin' && (
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                >
                  <span className="relative inline-block">
                    <NotificationIcon />
                    {!isLoadingNotifications && unreadCount > 0 && (
                      <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                </button>
                
                {notificationDropdownOpen && (
                  <NotificationDropdown onClose={() => setNotificationDropdownOpen(false)} />
                )}
              </div>
              
              {/* Sign Out Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-1 rounded text-sm hidden md:block"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
} 