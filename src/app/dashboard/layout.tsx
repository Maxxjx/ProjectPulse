'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnreadNotificationsCount } from '@/lib/hooks/useNotifications';
import NotificationsPanel from '@/components/NotificationsPanel';

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

// Instantiate a global QueryClient
const queryClient = new QueryClient();

function DashboardContent({ children }: { children: React.ReactNode }) {
  // All hooks are now called inside the provider
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeNavIndex, setActiveNavIndex] = useState(-1);
  const pathname = usePathname();
  const { unreadCount, isLoading: isLoadingNotifications } = useUnreadNotificationsCount();

  // Detect mobile screen size and auto-collapse sidebar
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Handle keyboard navigation with arrow keys
  const handleKeyboardNavigation = (e: React.KeyboardEvent, items: any[]) => {
    // Only handle keyboard navigation when sidebar is open
    if (!sidebarOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveNavIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveNavIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeNavIndex >= 0 && activeNavIndex < items.length) {
          // Simulate clicking the item
          window.location.href = items[activeNavIndex].href;
        }
        break;
      case 'Escape':
        // Close sidebar on Escape key
        if (isMobile && sidebarOpen) {
          setSidebarOpen(false);
        }
        break;
    }
  };

  // Get navigation items based on user role
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

  const navItems = getNavItems(session?.user?.role);

  // Focus trap for modal dialogs
  useEffect(() => {
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && notificationsOpen) {
        // Handle tab key focus trap for notifications panel
        // This is a simplified version - a real implementation would need to find all focusable elements
        const notificationsPanel = document.getElementById('notifications-panel');
        if (notificationsPanel) {
          const focusableElements = notificationsPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [notificationsOpen]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center" aria-live="polite" aria-busy="true">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]" role="status"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (!session) {
    // Redirect to login page or show access denied
    return (
      <div className="min-h-screen bg-[#1F2937] flex items-center justify-center">
        <div className="text-center" role="alert" aria-live="assertive">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-4">You must be signed in to access this page.</p>
          <Link href="/login" className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F2937] text-white flex">
      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className="fixed inset-y-0 left-0 bg-gradient-to-b from-[#111827] to-[#1F2937] z-50 w-64 transition-transform duration-300 transform"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="h-full flex flex-col">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} h-16 px-4 border-b border-gray-700`}>
            <Link href="/dashboard" className="flex items-center" aria-label="Dashboard Home">
              <div className="h-8 w-8 bg-[#8B5CF6] rounded-md flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              {sidebarOpen && <span className="ml-2 font-bold text-lg">ProjectPulse</span>}
            </Link>
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden text-gray-400 hover:text-white"
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            <nav 
              className="mt-5 px-2 space-y-1"
              onKeyDown={(e) => handleKeyboardNavigation(e, navItems)}
              role="menubar"
              aria-orientation="vertical"
            >
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`flex items-center py-2 px-3 rounded-md transition-all duration-200 ease-in-out ${
                      isActive 
                        ? 'bg-[#8B5CF6] text-white' 
                        : 'text-gray-300 hover:bg-[#1F2937] hover:text-white'
                    } ${!sidebarOpen && 'justify-center'}`}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                    tabIndex={0}
                    onFocus={() => setActiveNavIndex(index)}
                    aria-label={item.name}
                  >
                    <div className={`${sidebarOpen ? 'mr-3' : ''}`} aria-hidden="true">{item.icon}</div>
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User Profile Section */}
          <div className={`border-t border-gray-700 p-4 ${sidebarOpen ? '' : 'text-center'}`}>
            {session.user?.image ? (
              <div className={`flex ${sidebarOpen ? 'items-start' : 'justify-center'}`}>
                <div 
                  className="h-8 w-8 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <img src={session.user.image} alt={`${session.user.name}'s profile`} />
                </div>
                {sidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-gray-400">{session.user.role}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={`flex ${sidebarOpen ? 'items-start' : 'justify-center'}`}>
                <div 
                  className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"
                  aria-hidden="true"
                >
                  {session.user?.name?.[0] || "U"}
                </div>
                {sidebarOpen && (
                  <div className="ml-3">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-gray-400">{session.user.role}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="bg-gradient-to-r from-[#111827] to-[#1F2937] shadow-lg sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
                aria-expanded={sidebarOpen}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-controls="main-sidebar"
              >
                <MenuIcon />
              </button>
              
              {session?.user?.role === 'admin' && (
                <h1 className="text-xl font-bold ml-4 hidden sm:block">Admin Dashboard</h1>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  onClick={() => setNotificationsOpen(true)}
                  aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                  aria-haspopup="dialog"
                  aria-expanded={notificationsOpen}
                >
                  <span className="relative inline-block">
                    <NotificationIcon />
                    {!isLoadingNotifications && unreadCount > 0 && (
                      <span 
                        className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs"
                        aria-hidden="true"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                </button>
                
                {/* Render the new NotificationsPanel component */}
                <NotificationsPanel 
                  isOpen={notificationsOpen} 
                  onClose={() => setNotificationsOpen(false)} 
                />
              </div>
              
              {/* Mobile Profile Menu Button */}
              <div className="relative block md:hidden">
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center"
                  aria-label="Sign out"
                >
                  {session.user?.name?.[0] || "U"}
                </button>
              </div>
              
              {/* Sign Out Button (Desktop) */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-3 py-1 rounded text-sm shadow-lg"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main 
          className="flex-1"
          id="main-content"
          role="main"
          tabIndex={-1}
        >
          {children}
        </main>
        
        {/* Skip to content link (hidden until focused) */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#8B5CF6] focus:text-white"
        >
          Skip to content
        </a>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent>{children}</DashboardContent>
    </QueryClientProvider>
  );
}