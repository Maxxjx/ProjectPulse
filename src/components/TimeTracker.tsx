'use client';

import { useState, useEffect } from 'react';
import { 
  useActiveTimeEntry, 
  useStartTimeTracking,
  useStopTimeTracking,
  useTaskTimeEntries,
  formatDuration
} from '@/lib/hooks/useTimeTracking';
import type { TimeEntry } from '@/lib/hooks/useTimeTracking';

interface TimeTrackerProps {
  taskId: number;
  taskTitle: string;
}

export default function TimeTracker({ taskId, taskTitle }: TimeTrackerProps) {
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const { data: activeTimeEntry, isLoading: isLoadingActive } = useActiveTimeEntry();
  const { data: taskTimeEntries, isLoading: isLoadingEntries } = useTaskTimeEntries(taskId);
  const startTracking = useStartTimeTracking();
  const stopTracking = useStopTimeTracking();
  
  const isActiveTask = activeTimeEntry?.taskId === taskId;
  
  // Calculate elapsed time for the active task
  useEffect(() => {
    if (!isActiveTask || !activeTimeEntry) {
      return;
    }
    
    const startTime = new Date(activeTimeEntry.startTime).getTime();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [activeTimeEntry, isActiveTask]);
  
  // Calculate total time spent on this task
  const calculateTotalTime = () => {
    if (!taskTimeEntries) return 0;
    
    return taskTimeEntries.reduce((total, entry) => {
      // For completed entries, use the duration
      if (entry.duration !== null) {
        return total + entry.duration;
      }
      
      // For active entries, calculate current duration
      if (entry.endTime === null && isActiveTask) {
        return total + elapsedTime;
      }
      
      return total;
    }, 0);
  };
  
  const handleStartTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await startTracking.mutateAsync({
        taskId,
        description: description || `Working on "${taskTitle}"`
      });
      
      setDescription('');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to start time tracking:', error);
    }
  };
  
  const handleStopTracking = async () => {
    try {
      await stopTracking.mutateAsync();
    } catch (error) {
      console.error('Failed to stop time tracking:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="bg-[#1F2937] p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Time Tracking</h3>
        <div className="text-sm text-gray-400">
          Total: <span className="font-medium text-white">{formatDuration(calculateTotalTime())}</span>
        </div>
      </div>
      
      {/* Active Time Tracking */}
      {isLoadingActive ? (
        <div className="flex items-center justify-center h-10 animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
      ) : activeTimeEntry ? (
        <div className="mb-4 bg-[#111827] p-3 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <div className="mb-2 sm:mb-0">
              <span className="text-sm font-medium">Currently tracking:</span>
              <p className="text-sm text-gray-400 mt-1">{activeTimeEntry.description}</p>
            </div>
            <div className="text-xl font-mono">{formatDuration(isActiveTask ? elapsedTime : 0)}</div>
          </div>
          {isActiveTask ? (
            <button
              onClick={handleStopTracking}
              disabled={stopTracking.isPending}
              className="w-full py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 transition rounded-md text-white flex items-center justify-center touch-manipulation"
            >
              {stopTracking.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Stopping...
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Tracking
                </>
              )}
            </button>
          ) : (
            <p className="text-sm text-yellow-400 mt-2">
              You have an active time entry for another task.
            </p>
          )}
        </div>
      ) : isFormOpen ? (
        <form onSubmit={handleStartTracking} className="mb-4">
          <div className="mb-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
              What are you working on?
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Working on "${taskTitle}"`}
              className="w-full px-3 py-2 bg-[#111827] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="submit"
              disabled={startTracking.isPending}
              className="w-full py-3 sm:py-2 bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 transition rounded-md flex items-center justify-center touch-manipulation"
            >
              {startTracking.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Starting...
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Tracking
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="py-3 sm:py-2 px-4 border border-gray-700 hover:bg-[#111827] active:bg-[#0a0f16] transition rounded-md touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsFormOpen(true)}
          disabled={!!activeTimeEntry}
          className="w-full py-3 sm:py-2 bg-[#8B5CF6] hover:bg-opacity-90 active:bg-opacity-100 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition rounded-md mb-4 flex items-center justify-center touch-manipulation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Start Tracking
        </button>
      )}
      
      {/* Time Entries List - Collapsible on Mobile */}
      <div className="border-t border-gray-700 pt-4 mt-2">
        <details className="sm:hidden mb-2" open>
          <summary className="text-sm font-medium cursor-pointer focus:outline-none">
            Recent Time Entries
          </summary>
          <div className="mt-2">
            {isLoadingEntries ? (
              <div className="space-y-2 animate-pulse">
                {[1, 2].map(i => (
                  <div key={i} className="h-12 bg-[#111827] rounded-md">
                    <div className="h-3 bg-gray-700 rounded w-3/4 mb-1 mt-2 mx-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/4 mx-2"></div>
                  </div>
                ))}
              </div>
            ) : !taskTimeEntries || taskTimeEntries.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No time entries yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {taskTimeEntries
                  .filter(entry => entry.endTime !== null)
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .slice(0, 3) // Only show most recent 3 on mobile
                  .map(entry => (
                    <div key={entry.id} className="bg-[#111827] p-2 rounded-md text-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{entry.description}</p>
                          <p className="text-xs text-gray-400">{formatDate(entry.startTime)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono">{formatDuration(entry.duration)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </details>
        
        {/* Desktop Time Entries */}
        <div className="hidden sm:block">
          <h4 className="text-sm font-medium mb-2">Recent Time Entries</h4>
          {isLoadingEntries ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-[#111827] rounded-md">
                  <div className="h-3 bg-gray-700 rounded w-3/4 mb-1 mt-2 mx-2"></div>
                  <div className="h-2 bg-gray-700 rounded w-1/4 mx-2"></div>
                </div>
              ))}
            </div>
          ) : !taskTimeEntries || taskTimeEntries.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No time entries yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {taskTimeEntries
                .filter(entry => entry.endTime !== null)
                .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                .map(entry => (
                  <div key={entry.id} className="bg-[#111827] p-2 rounded-md text-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{entry.description}</p>
                        <p className="text-xs text-gray-400">{formatDate(entry.startTime)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono">{formatDuration(entry.duration)}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 