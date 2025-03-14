import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();

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
      href: "/dashboard/team",
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
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>RS</AvatarFallback>
          </Avatar>
          <div className="hidden group-hover:block lg:block">
            <p className="text-sm font-medium">Rajesh Sharma</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
} 