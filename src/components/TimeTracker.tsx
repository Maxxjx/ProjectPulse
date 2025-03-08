'use client';

import { useState, useEffect } from 'react';

interface TimeEntry {
  id: number;
  description: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // In seconds
}

interface TimeTrackerProps {
  taskId: number;
  taskName: string;
  onTimeEntryAdded?: (entry: TimeEntry) => void;
}

export default function TimeTracker({ taskId, taskName, onTimeEntryAdded }: TimeTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Omit<TimeEntry, 'id' | 'duration'> | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // In seconds
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Load time entries from local storage
  useEffect(() => {
    const storedEntries = localStorage.getItem(`timeEntries_${taskId}`);
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries);
      // Convert string dates back to Date objects
      const formattedEntries = parsedEntries.map((entry: any) => ({
        ...entry,
        startTime: new Date(entry.startTime),
        endTime: entry.endTime ? new Date(entry.endTime) : null
      }));
      setTimeEntries(formattedEntries);
    }
  }, [taskId]);

  // Save time entries to local storage
  useEffect(() => {
    if (timeEntries.length > 0) {
      localStorage.setItem(`timeEntries_${taskId}`, JSON.stringify(timeEntries));
    }
  }, [timeEntries, taskId]);

  // Start tracking time
  const startTracking = () => {
    if (isTracking) return;
    
    const entry = {
      description: description || `Working on ${taskName}`,
      startTime: new Date(),
      endTime: null
    };
    
    setCurrentEntry(entry);
    setIsTracking(true);
    setElapsedTime(0);
    
    // Start timer
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  // Stop tracking time
  const stopTracking = () => {
    if (!isTracking || !currentEntry || !timerInterval) return;
    
    clearInterval(timerInterval);
    setTimerInterval(null);
    
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - currentEntry.startTime.getTime()) / 1000);
    
    const newEntry: TimeEntry = {
      id: Date.now(),
      ...currentEntry,
      endTime,
      duration
    };
    
    setTimeEntries(prev => [...prev, newEntry]);
    setCurrentEntry(null);
    setIsTracking(false);
    setDescription('');
    
    if (onTimeEntryAdded) {
      onTimeEntryAdded(newEntry);
    }
  };

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

  // Calculate total time spent
  const totalTime = timeEntries.reduce((total, entry) => total + entry.duration, 0);

  return (
    <div className="bg-[#111827] rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Time Tracking</h2>
      
      {isTracking ? (
        <div className="mb-4">
          <div className="text-3xl font-mono text-center mb-2">{formatTime(elapsedTime)}</div>
          <p className="text-sm text-gray-400 text-center mb-4">{currentEntry?.description}</p>
          <button
            onClick={stopTracking}
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 transition rounded-md"
          >
            Stop Tracking
          </button>
        </div>
      ) : (
        <div className="mb-4">
          <div className="mb-3">
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Working on ${taskName}`}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          <button
            onClick={startTracking}
            className="w-full py-2 px-4 bg-[#8B5CF6] hover:bg-opacity-90 transition rounded-md"
          >
            Start Tracking
          </button>
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Recent Time Entries</h3>
          <span className="text-sm text-gray-400">
            Total: {formatTime(totalTime)}
          </span>
        </div>
        {timeEntries.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {timeEntries.slice().reverse().map((entry) => (
              <div key={entry.id} className="bg-[#1F2937] p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{entry.description}</span>
                  <span className="text-sm text-[#8B5CF6]">{formatTime(entry.duration)}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(entry.startTime)} - {entry.endTime ? formatDate(entry.endTime) : 'Ongoing'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">
            No time entries yet.
          </div>
        )}
      </div>
    </div>
  );
} 