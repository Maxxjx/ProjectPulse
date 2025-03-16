import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  BarChartHorizontal,
  FileBarChart,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  // Load the collapsed state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    } else {
      // Default to expanded on larger screens, collapsed on small screens
      setCollapsed(window.innerWidth < 1024);
    }
  }, []);
  
  // Save the collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(collapsed));
  }, [collapsed]);

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <ListTodo className="h-5 w-5" />,
    },
    {
      title: "Team",
      href: "/dashboard/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChartHorizontal className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <FileBarChart className="h-5 w-5" />,
    },
  ];

  return (
    <div className={cn(
      "relative flex h-screen flex-col items-center justify-between border-r bg-background py-3 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle button */}
      <button 
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-md focus:outline-none"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? 
          <ChevronRight className="h-3 w-3" /> : 
          <ChevronLeft className="h-3 w-3" />
        }
      </button>
      
      <div className="flex w-full flex-col items-center px-2">
        <div className="flex h-16 w-full items-center justify-center px-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">PP</span>
            </div>
            {!collapsed && (
              <span className="ml-2 text-xl font-bold">
                ProjectPulse
              </span>
            )}
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)] w-full">
          <div className="mt-4 space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 w-full items-center justify-start rounded-md px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground"
                )}
              >
                <div className="flex w-10 items-center justify-center">
                  {item.icon}
                </div>
                {!collapsed && (
                  <span className="ml-2">
                    {item.title}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="w-full space-y-1 px-4">
        <Button
          variant="ghost"
          className="flex h-10 w-full items-center justify-start px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => window.location.href = '/dashboard/settings'}
        >
          <div className="flex w-10 items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="ml-2">
              Settings
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          className="flex h-10 w-full items-center justify-start px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => window.location.href = '/dashboard/help'}
        >
          <div className="flex w-10 items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="ml-2">
              Help
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          className="flex h-10 w-full items-center justify-start px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <div className="flex w-10 items-center justify-center">
            <LogOut className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="ml-2">
              Logout
            </span>
          )}
        </Button>

        <div className="my-4 flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Rajesh Sharma</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}