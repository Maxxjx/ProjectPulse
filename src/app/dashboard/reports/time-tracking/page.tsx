'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface TimeEntry {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // In seconds
  taskId: number;
  taskName: string;
}

// Sample task data for reference
const sampleTasks = [
  { id: 1, title: 'Implement Login Page' },
  { id: 2, title: 'Setup API Routes' },
  { id: 3, title: 'Design Database Schema' },
  { id: 4, title: 'Implement User Registration' },
  { id: 5, title: 'Create Dashboard Layout' },
  { id: 6, title: 'Write Unit Tests' },
  { id: 7, title: 'Setup CI/CD Pipeline' },
  { id: 8, title: 'Implement Task Management' },
  { id: 9, title: 'Design System Documentation' },
];

export default function TimeTrackingReportView() {
  const { data: session } = useSession();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<TimeEntry[]>([]);
  const [dateRange, setDateRange] = useState('week');
  const [taskFilter, setTaskFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [groupBy, setGroupBy] = useState('none');
  
  // Load time entries from local storage
  useEffect(() => {
    const allEntries: TimeEntry[] = [];
    
    // For demonstration, we'll simulate loading entries for all tasks
    sampleTasks.forEach(task => {
      const storedEntries = localStorage.getItem(`timeEntries_${task.id}`);
      if (storedEntries) {
        const parsedEntries = JSON.parse(storedEntries);
        // Convert string dates back to Date objects and add task info
        const formattedEntries = parsedEntries.map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : null,
          taskId: task.id,
          taskName: task.title
        }));
        allEntries.push(...formattedEntries);
      }
    });
    
    setTimeEntries(allEntries);
  }, []);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...timeEntries];
    
    // Filter by date range
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (dateRange === 'today') {
      filtered = filtered.filter(entry => entry.startTime >= startOfDay);
    } else if (dateRange === 'week') {
      const startOfWeek = new Date(startOfDay);
      startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
      filtered = filtered.filter(entry => entry.startTime >= startOfWeek);
    } else if (dateRange === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(entry => entry.startTime >= startOfMonth);
    }
    
    // Filter by task
    if (taskFilter !== 'all') {
      const taskId = parseInt(taskFilter);
      filtered = filtered.filter(entry => entry.taskId === taskId);
    }
    
    // Sort entries
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } else if (sortBy === 'duration') {
      filtered.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === 'task') {
      filtered.sort((a, b) => a.taskName.localeCompare(b.taskName));
    }
    
    setFilteredEntries(filtered);
  }, [timeEntries, dateRange, taskFilter, sortBy]);
  
  // Format time in HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      remainingSeconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };
  
  // Calculate totals
  const totalTime = filteredEntries.reduce((total, entry) => total + entry.duration, 0);
  
  // Group time entries if needed
  const getGroupedEntries = () => {
    if (groupBy === 'none') {
      return filteredEntries;
    }
    
    const grouped: Record<string, TimeEntry[]> = {};
    
    filteredEntries.forEach(entry => {
      let key = '';
      
      if (groupBy === 'task') {
        key = `${entry.taskId}-${entry.taskName}`;
      } else if (groupBy === 'day') {
        key = entry.startTime.toLocaleDateString();
      }
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(entry);
    });
    
    return Object.values(grouped).flat();
  };
  
  // Get unique tasks for filter
  const tasks = [
    { id: 'all', name: 'All Tasks' },
    ...sampleTasks.map(task => ({ id: task.id.toString(), name: task.title }))
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Time Tracking Reports</h1>
        <Link 
          href="/dashboard/tasks" 
          className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
        >
          Back to Tasks
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-400 mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="taskFilter" className="block text-sm font-medium text-gray-400 mb-1">
              Task
            </label>
            <select
              id="taskFilter"
              value={taskFilter}
              onChange={(e) => setTaskFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-400 mb-1">
              Sort By
            </label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option value="date">Date (newest first)</option>
              <option value="duration">Duration (longest first)</option>
              <option value="task">Task Name</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="groupBy" className="block text-sm font-medium text-gray-400 mb-1">
              Group By
            </label>
            <select
              id="groupBy"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option value="none">No Grouping</option>
              <option value="task">Task</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-sm text-gray-400 mb-1">Total Time</h2>
          <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-sm text-gray-400 mb-1">Total Entries</h2>
          <p className="text-2xl font-bold">{filteredEntries.length}</p>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-sm text-gray-400 mb-1">Average Per Entry</h2>
          <p className="text-2xl font-bold">
            {filteredEntries.length > 0 ? formatTime(totalTime / filteredEntries.length) : '00:00:00'}
          </p>
        </div>
        
        <div className="bg-[#111827] rounded-lg p-6">
          <h2 className="text-sm text-gray-400 mb-1">Tasks Tracked</h2>
          <p className="text-2xl font-bold">
            {new Set(filteredEntries.map(entry => entry.taskId)).size}
          </p>
        </div>
      </div>
      
      {/* Time Entries Table */}
      <div className="bg-[#111827] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1F2937]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Task
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Start Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  End Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEntries.length > 0 ? (
                getGroupedEntries().map((entry) => (
                  <tr key={entry.id} className="hover:bg-[#1F2937]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/dashboard/tasks/${entry.taskId}`}
                        className="text-[#8B5CF6] hover:text-[#A78BFA]"
                      >
                        {entry.taskName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{entry.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(entry.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {entry.endTime ? formatDate(entry.endTime) : 'Ongoing'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {formatTime(entry.duration)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                    No time entries found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 