'use client';

import { useState, useEffect } from 'react';
import { CalendarDateRangePicker } from './date-range-picker';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DashboardFiltersProps {
  onFilterChange: (filters: DashboardFilters) => void;
  projects?: Array<{ id: string; name: string }>;
  statuses?: Array<{ value: string; label: string }>;
  departments?: Array<{ value: string; label: string }>;
  showProjectFilter?: boolean;
  showStatusFilter?: boolean;
  showDateRange?: boolean;
  showDepartmentFilter?: boolean;
  className?: string;
}

export interface DashboardFilters {
  projectId?: string;
  status?: string;
  dateRange?: DateRange;
  departmentId?: string;
}

export function DashboardFilters({
  onFilterChange,
  projects = [],
  statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'on-hold', label: 'On Hold' },
  ],
  departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'management', label: 'Management' },
  ],
  showProjectFilter = true,
  showStatusFilter = true,
  showDateRange = true,
  showDepartmentFilter = true,
  className,
}: DashboardFiltersProps) {
  const [filters, setFilters] = useState<DashboardFilters>({
    projectId: undefined,
    status: undefined,
    dateRange: undefined,
    departmentId: undefined,
  });

  const [open, setOpen] = useState({
    project: false,
    status: false,
    department: false,
  });

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle date range change
  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setFilters((prev) => ({ ...prev, dateRange }));
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      projectId: undefined,
      status: undefined,
      dateRange: undefined,
      departmentId: undefined,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = !!filters.projectId || !!filters.status || !!filters.dateRange || !!filters.departmentId;

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        {/* Project Filter */}
        {showProjectFilter && projects.length > 0 && (
          <Popover open={open.project} onOpenChange={(o) => setOpen({ ...open, project: o })}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open.project}
                className="w-full md:w-[200px] justify-between bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                {filters.projectId ? 
                  projects.find((project) => project.id === filters.projectId)?.name || "Select project" : 
                  "Select project"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[200px] p-0 bg-gray-800 border-gray-600">
              <Command className="bg-transparent">
                <CommandInput placeholder="Search projects..." className="text-white" />
                <CommandEmpty>No projects found.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      value={project.name}
                      onSelect={() => {
                        setFilters((prev) => ({ ...prev, projectId: project.id === filters.projectId ? undefined : project.id }));
                        setOpen({ ...open, project: false });
                      }}
                      className="text-white hover:bg-gray-700"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.projectId === project.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {project.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Status Filter */}
        {showStatusFilter && (
          <Popover open={open.status} onOpenChange={(o) => setOpen({ ...open, status: o })}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open.status}
                className="w-full md:w-[180px] justify-between bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                {filters.status ? 
                  statuses.find((status) => status.value === filters.status)?.label || "Select status" : 
                  "Select status"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[180px] p-0 bg-gray-800 border-gray-600">
              <Command className="bg-transparent">
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {statuses.map((status) => (
                    <CommandItem
                      key={status.value}
                      value={status.label}
                      onSelect={() => {
                        setFilters((prev) => ({ ...prev, status: status.value === "all" ? undefined : status.value === filters.status ? undefined : status.value }));
                        setOpen({ ...open, status: false });
                      }}
                      className="text-white hover:bg-gray-700"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.status === status.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {status.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Department Filter */}
        {showDepartmentFilter && (
          <Popover open={open.department} onOpenChange={(o) => setOpen({ ...open, department: o })}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open.department}
                className="w-full md:w-[200px] justify-between bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                {filters.departmentId ? 
                  departments.find((dept) => dept.value === filters.departmentId)?.label || "Select department" : 
                  "Select department"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full md:w-[200px] p-0 bg-gray-800 border-gray-600">
              <Command className="bg-transparent">
                <CommandGroup className="max-h-60 overflow-y-auto">
                  {departments.map((department) => (
                    <CommandItem
                      key={department.value}
                      value={department.label}
                      onSelect={() => {
                        setFilters((prev) => ({ ...prev, departmentId: department.value === "all" ? undefined : department.value === filters.departmentId ? undefined : department.value }));
                        setOpen({ ...open, department: false });
                      }}
                      className="text-white hover:bg-gray-700"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.departmentId === department.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {department.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}

        {/* Date Range Picker */}
        {showDateRange && (
          <CalendarDateRangePicker
            dateRange={filters.dateRange}
            setDateRange={handleDateRangeChange}
          />
        )}
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-gray-400 hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
