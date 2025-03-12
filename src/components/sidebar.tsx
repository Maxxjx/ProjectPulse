import {
  CalendarDays,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  BarChartHorizontal,
  FileBarChart,
} from "lucide-react";

export function Sidebar() {
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
} 