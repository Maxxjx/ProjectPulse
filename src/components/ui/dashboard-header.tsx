import React from 'react';
import { Button } from '@/components/ui/button';
import { theme } from '@/lib/utils/theme';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
}

interface DashboardTabsProps {
  tabs: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardTabs({ tabs, currentTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="flex overflow-x-auto pb-2 mb-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-4 py-2 flex items-center gap-2 font-medium text-sm whitespace-nowrap transition-colors ${
            currentTab === tab.value
              ? `text-primary border-b-2 border-primary`
              : `text-muted-foreground hover:text-foreground`
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface DashboardEmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardEmptyState({ 
  title, 
  description, 
  icon, 
  action 
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 my-10 rounded-xl border border-border bg-card/50">
      {icon && (
        <div className="rounded-full bg-primary-foreground p-3 mb-4 text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
