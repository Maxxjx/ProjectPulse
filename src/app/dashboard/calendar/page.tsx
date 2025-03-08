'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Mock task data
const mockTasks = [
  {
    id: 1,
    title: 'Implement Login Page',
    status: 'To Do',
    dueDate: '2023-07-20',
    priority: 'High',
    assignee: 'Sarah Smith',
    project: 'Website Redesign',
  },
  {
    id: 2,
    title: 'Setup API Routes',
    status: 'In Progress',
    dueDate: '2023-07-12',
    priority: 'High',
    assignee: 'Michael Chen',
    project: 'Website Redesign',
  },
  {
    id: 3,
    title: 'Design Database Schema',
    status: 'Done',
    dueDate: '2023-07-05',
    priority: 'Medium',
    assignee: 'John Doe',
    project: 'Database Migration',
  },
  {
    id: 4,
    title: 'Implement User Registration',
    status: 'In Progress',
    dueDate: '2023-07-18',
    priority: 'Medium',
    assignee: 'Sarah Smith',
    project: 'Website Redesign',
  },
  {
    id: 5,
    title: 'Create Dashboard Layout',
    status: 'To Do',
    dueDate: '2023-07-25',
    priority: 'High',
    assignee: 'Michael Chen',
    project: 'Admin Panel',
  },
  {
    id: 6,
    title: 'Write Unit Tests',
    status: 'To Do',
    dueDate: '2023-07-30',
    priority: 'Low',
    assignee: 'John Doe',
    project: 'Website Redesign',
  },
  {
    id: 7,
    title: 'Setup CI/CD Pipeline',
    status: 'Done',
    dueDate: '2023-07-03',
    priority: 'Medium',
    assignee: 'Michael Chen',
    project: 'DevOps',
  },
  {
    id: 8,
    title: 'Implement Task Management',
    status: 'In Progress',
    dueDate: '2023-07-21',
    priority: 'High',
    assignee: 'Sarah Smith',
    project: 'Website Redesign',
  },
  {
    id: 9,
    title: 'Design System Documentation',
    status: 'Done',
    dueDate: '2023-07-10',
    priority: 'Low',
    assignee: 'John Doe',
    project: 'Documentation',
  },
];

// Get priority color class
function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High':
      return 'bg-red-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'Low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}

// Get status color class
function getStatusColor(status: string) {
  switch (status) {
    case 'To Do':
      return 'border-gray-500';
    case 'In Progress':
      return 'border-blue-500';
    case 'Done':
      return 'border-green-500';
    default:
      return 'border-gray-500';
  }
}

export default function CalendarPage() {
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  
  // Simulate fetching task data
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      
      try {
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Set mock data
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  // Calendar navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Array to store all days to display (including days from previous and next months)
    const calendarDays = [];
    
    // Add days from previous month
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateStr = `${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      calendarDays.push({
        date: dateStr,
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Add days from current month
    const today = new Date();
    const isCurrentMonthAndYear = today.getMonth() === month && today.getFullYear() === year;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      calendarDays.push({
        date: dateStr,
        day,
        isCurrentMonth: true,
        isToday: isCurrentMonthAndYear && today.getDate() === day,
      });
    }
    
    // Add days from next month
    const daysToAdd = 42 - calendarDays.length; // 6 rows x 7 columns
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    
    for (let day = 1; day <= daysToAdd; day++) {
      const dateStr = `${nextMonthYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      calendarDays.push({
        date: dateStr,
        day,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return calendarDays;
  };
  
  // Get tasks for a specific date
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter(task => task.dueDate === dateStr);
  };
  
  // Format date for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Generate calendar grid
  const calendarDays = getDaysInMonth(currentDate);
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Calendar</h1>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-[#1F2937] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm bg-[#1F2937] hover:bg-[#283548] rounded-md"
          >
            Today
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-[#1F2937] rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className="text-lg font-medium ml-2">
            {formatMonthYear(currentDate)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'month' ? 'bg-[#8B5CF6] text-white' : 'bg-[#1F2937] hover:bg-[#283548]'
            }`}
          >
            Month
          </button>
          
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'week' ? 'bg-[#8B5CF6] text-white' : 'bg-[#1F2937] hover:bg-[#283548]'
            }`}
          >
            Week
          </button>
          
          <button
            onClick={() => setView('day')}
            className={`px-3 py-1 text-sm rounded-md ${
              view === 'day' ? 'bg-[#8B5CF6] text-white' : 'bg-[#1F2937] hover:bg-[#283548]'
            }`}
          >
            Day
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-[#1F2937] rounded-lg p-6 animate-pulse">
          <div className="grid grid-cols-7 gap-px bg-gray-700">
            {[...Array(7)].map((_, index) => (
              <div key={index} className="h-8 bg-[#1F2937]"></div>
            ))}
            {[...Array(35)].map((_, index) => (
              <div key={index + 7} className="h-32 bg-[#1F2937]"></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#1F2937] rounded-lg shadow-lg overflow-hidden">
          {/* Calendar Header (Days of the week) */}
          <div className="grid grid-cols-7 gap-px bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-center text-gray-300 bg-[#111827] text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-700">
            {calendarDays.map((day, index) => {
              const tasksForDay = getTasksForDate(day.date);
              
              return (
                <div
                  key={index}
                  className={`min-h-32 p-1 sm:p-2 ${
                    day.isCurrentMonth ? 'bg-[#1F2937]' : 'bg-[#111827] text-gray-500'
                  } ${day.isToday ? 'ring-2 ring-[#8B5CF6] ring-inset' : ''}`}
                >
                  <div className="text-right text-sm mb-1">{day.day}</div>
                  
                  <div className="space-y-1 overflow-y-auto max-h-24 sm:max-h-28">
                    {tasksForDay.map(task => (
                      <Link
                        key={task.id}
                        href={`/dashboard/tasks/${task.id}`}
                        className={`block p-1 text-xs rounded truncate border-l-2 ${getStatusColor(task.status)} bg-[#111827] hover:bg-[#1F2937]`}
                      >
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mr-1`}></span>
                          <span className="truncate">{task.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Export Options */}
      <div className="mt-6 flex justify-end">
        <div className="dropdown relative inline-block">
          <button className="bg-[#1F2937] hover:bg-[#283548] text-sm rounded px-4 py-2 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="hidden dropdown-menu absolute right-0 mt-2 w-48 bg-[#1F2937] rounded-md shadow-lg z-10 py-1">
            <a href="#" className="block px-4 py-2 text-sm hover:bg-[#283548]">Export as iCal</a>
            <a href="#" className="block px-4 py-2 text-sm hover:bg-[#283548]">Export as CSV</a>
            <a href="#" className="block px-4 py-2 text-sm hover:bg-[#283548]">Print Calendar</a>
          </div>
        </div>
      </div>
    </div>
  );
} 