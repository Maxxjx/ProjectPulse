'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUnreadNotificationsCount } from '@/lib/hooks/useNotifications';
import NotificationsPanel from '@/components/NotificationsPanel';
import { Toaster } from 'react-hot-toast';

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
      const isMobileView = window.innerWidth < 1024; // Increased breakpoint for better UX
      setIsMobile(isMobileView);
      if (isMobileView) {
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
      {/* Toast notifications */}
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#374151',
          color: '#fff',
          borderRadius: '0.375rem',
          border: '1px solid rgba(75, 85, 99, 0.3)',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }} />
      
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
        className="fixed inset-y-0 left-0 bg-gradient-to-b from-gray-900 to-gray-800 z-50 w-64 transition-all duration-300 transform shadow-xl backdrop-blur-sm border-r border-gray-700/30"
        role="navigation"
        aria-label="Main Navigation"
      >
        <div className="h-full flex flex-col">
          <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} h-20 px-6 border-b border-gray-700/30`}>
            <Link href="/dashboard" className="flex items-center" aria-label="Dashboard Home">
              <div className="h-9 w-9 gradient-primary rounded-md flex items-center justify-center shadow-md transform transition-transform hover:scale-105 duration-200">
                <span className="text-white font-bold">P</span>
              </div>
              {sidebarOpen && <span className="ml-3 font-bold text-lg gradient-text gradient-primary">ProjectPulse</span>}
            </Link>
            
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="md:hidden text-gray-400 hover:text-white hover:bg-gray-700/40 p-1.5 rounded-full transition-colors duration-200"
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
              className="mt-6 px-3 space-y-1.5"
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
                    className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 ease-in-out ${
                      isActive 
                        ? 'bg-primary/10 text-primary-light' 
                        : 'text-gray-300 hover:bg-gray-700/40 hover:text-white'
                    } ${!sidebarOpen && 'justify-center'}`}
                    aria-current={isActive ? 'page' : undefined}
                    role="menuitem"
                    tabIndex={0}
                    onFocus={() => setActiveNavIndex(index)}
                    aria-label={item.name}
                  >
                    <div className={`${sidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-primary scale-110' : 'text-gray-400 group-hover:text-gray-100'} transition-all duration-200`} aria-hidden="true">{item.icon}</div>
                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                    {sidebarOpen && isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-light" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* User Profile Section */}
          <div className={`border-t border-gray-700/30 mt-auto ${sidebarOpen ? '' : 'text-center'}`}>
            {/* Quick settings */}
            {sidebarOpen && (
              <div className="px-3 py-3 flex justify-around">
                <button
                  className="rounded-full p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                  aria-label="Settings"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="rounded-full p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200 relative"
                  aria-label="Notifications"
                  aria-haspopup="dialog"
                  aria-expanded={notificationsOpen}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary-dark flex items-center justify-center text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <button
                  className="rounded-full p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                  aria-label="Help"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}

            {/* User profile */}
            <div className="p-4 hover:bg-gray-700/30 transition-colors duration-200 cursor-pointer">
              <div className={`flex ${sidebarOpen ? 'items-center' : 'justify-center flex-col gap-1'}`}>
                {session.user?.image ? (
                  <div className="h-10 w-10 rounded-full overflow-hidden shadow-md flex-shrink-0">
                    <img 
                      src={session.user.image} 
                      alt={`${session.user.name}'s profile`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent overflow-hidden flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                    {session.user?.name?.[0].toUpperCase() || "U"}
                  </div>
                )}
                
                {sidebarOpen ? (
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.role}</p>
                  </div>
                ) : (
                  <div className="mt-1 text-xs text-gray-400">{session.user.role}</div>
                )}
                
                {sidebarOpen && (
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors duration-200"
                    aria-label="Sign out"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm sticky top-0 z-40 transition-all duration-300">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors duration-200 focus-ring"
                aria-expanded={sidebarOpen}
                aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-controls="main-sidebar"
              >
                <MenuIcon />
              </button>
              
              {session?.user?.role === 'admin' && (
                <h1 className="text-xl font-bold ml-4 hidden sm:block text-gray-800 dark:text-white gradient-text gradient-primary">Admin Dashboard</h1>
              )}
              
              {/* Breadcrumbs */}
              <div className="ml-4 hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Link href="/dashboard" className="hover:text-primary transition-colors duration-200">Dashboard</Link>
                {pathname !== '/dashboard' && (
                  <>
                    <span className="mx-2">/</span>
                    <span className="text-gray-800 dark:text-white capitalize font-medium">
                      {pathname.split('/').pop()}
                    </span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative max-w-xs hidden md:block">
                <input 
                  type="text" 
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700/50 border-0 text-sm focus-ring" 
                  placeholder="Search..." 
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <button 
                  className="relative rounded-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  onClick={() => setNotificationsOpen(true)}
                  aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                  aria-haspopup="dialog"
                  aria-expanded={notificationsOpen}
                >
                  <span className="relative inline-block">
                    <NotificationIcon />
                    {!isLoadingNotifications && unreadCount > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-white ring-2 ring-white dark:ring-gray-800"
                        aria-hidden="true"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </span>
                </button>

                {/* Create new button */}
                <button
                  className="rounded-full p-2 text-white bg-primary hover:bg-primary-dark transition-colors duration-200 shadow-md hidden md:flex items-center"
                  aria-label="Create new"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* User profile */}
                <div className="relative">
                  {session.user?.image ? (
                    <div className="h-9 w-9 rounded-full overflow-hidden shadow-md cursor-pointer">
                      <img 
                        src={session.user.image} 
                        alt={`${session.user.name}'s profile`} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent overflow-hidden flex items-center justify-center text-white font-bold cursor-pointer shadow-md"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Render the notifications panel */}
              <NotificationsPanel 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main 
          className="flex-1 p-4 md:p-6 lg:p-8"
          id="main-content"
          role="main"
          tabIndex={-1}
        >
          <div className="animate-in">
            {children}
          </div>
        </main>
        
        {/* Skip to content link (hidden until focused) */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:shadow-lg"
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