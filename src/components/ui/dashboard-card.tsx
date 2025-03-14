import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  children?: React.ReactNode;
}

export function DashboardCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  children,
  ...props
}: DashboardCardProps) {
  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {trend && (
          <div className="mt-1 flex items-center text-sm">
            <span
              className={cn(
                "mr-1",
                trend.isPositive 
                  ? "text-green-500" 
                  : "text-red-500"
              )}
            >
              {trend.isPositive ? (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" 
                    clipRule="evenodd" 
                  />
                </svg>
              ) : (
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-4 h-4"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z" 
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </span>
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.value}%
            </span>
            <span className="ml-1 text-muted-foreground">{description}</span>
          </div>
        )}
        
        {!trend && description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
        
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
    </Card>
  );
}
