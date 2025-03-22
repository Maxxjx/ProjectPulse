import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // Add this import
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { ScrollArea } from "@/components/ui/scroll-area"; // Add this import

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Define navigation items with role restrictions
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ["ADMIN", "TEAM", "CLIENT", "USER"],
    },
    {
      title: "Projects",
      href: "/dashboard/projects",
      icon: <FolderKanban className="h-5 w-5" />,
      roles: ["ADMIN", "TEAM", "CLIENT"],
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      icon: <ListTodo className="h-5 w-5" />,
      roles: ["ADMIN", "TEAM", "CLIENT"],
    },
    {
      title: "Team",
      href: "/dashboard/team",
      icon: <Users className="h-5 w-5" />,
      roles: ["ADMIN"],
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: <CalendarDays className="h-5 w-5" />,
      roles: ["ADMIN", "TEAM"],
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChartHorizontal className="h-5 w-5" />,
      roles: ["ADMIN", "TEAM"],
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: <FileBarChart className="h-5 w-5" />,
      roles: ["ADMIN", "TEAM", "CLIENT"],
    },
  ];

  // Filter navigation items based on user role and log for debugging
  const userRole = (session?.user?.role as string)?.toUpperCase();
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  console.log('Current user role:', session?.user?.role);
  console.log('Filtered nav items:', filteredNavItems);

  return (
    <div className="group flex h-screen w-16 flex-col items-center justify-between border-r bg-background py-3 transition-all duration-300 hover:w-64 lg:w-64">
      <div className="flex w-full flex-col items-center px-2">
        <div className="flex h-16 w-full items-center justify-center px-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <span className="text-lg font-bold text-primary-foreground">PP</span>
            </div>
            <span className="ml-2 hidden text-xl font-bold group-hover:inline-block lg:inline-block">
              ProjectPulse
            </span>
          </Link>
        </div>

        <ScrollArea className="h-[calc(100vh-10rem)] w-full">
          <div className="mt-4 space-y-1 px-2">
            {filteredNavItems.map((item) => (
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
                <span className="ml-2 hidden group-hover:inline-block lg:inline-block">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="w-full space-y-1 px-4">
        <Button
          variant="ghost"
          className="flex h-10 w-full items-center justify-start px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <div className="flex w-10 items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <span className="ml-2 hidden group-hover:inline-block lg:inline-block">
            Settings
          </span>
        </Button>
        <Button
          variant="ghost"
          className="flex h-10 w-full items-center justify-start px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <div className="flex w-10 items-center justify-center">
            <HelpCircle className="h-5 w-5" />
          </div>
          <span className="ml-2 hidden group-hover:inline-block lg:inline-block">
            Help
          </span>
        </Button>
        <Button
          variant="ghost"
          className="flex h-10 w-full items-center justify-start px-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <div className="flex w-10 items-center justify-center">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="ml-2 hidden group-hover:inline-block lg:inline-block">
            Logout
          </span>
        </Button>

        <div className="my-4 flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
            <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="hidden group-hover:block lg:block">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}