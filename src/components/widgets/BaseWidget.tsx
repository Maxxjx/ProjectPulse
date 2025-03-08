'use client';

import { useState } from 'react';
import { DashboardWidget } from '@/lib/data/types';
import { useRemoveWidget } from '@/lib/hooks/useWidgets';

interface BaseWidgetProps {
  widget: DashboardWidget;
  children: React.ReactNode;
  isDragging?: boolean;
}

export default function BaseWidget({ widget, children, isDragging = false }: BaseWidgetProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const removeWidgetMutation = useRemoveWidget();
  
  const handleRemoveWidget = () => {
    if (confirm('Are you sure you want to remove this widget?')) {
      removeWidgetMutation.mutate(widget.id);
    }
  };
  
  // Determine widget size class
  const sizeClass = widget.size === 'large' 
    ? 'col-span-full' 
    : widget.size === 'medium' 
      ? 'col-span-2 md:col-span-1 lg:col-span-2' 
      : 'col-span-2 md:col-span-1';
  
  return (
    <div 
      className={`
        bg-[#111827] rounded-lg border border-gray-700 overflow-hidden
        ${isDragging ? 'opacity-70 border-[#8B5CF6] shadow-lg' : ''}
        ${sizeClass}
      `}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-medium">{widget.title}</h3>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-400 hover:text-white p-1 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          
          {isMenuOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-[#1F2937] rounded-md shadow-lg z-10 border border-gray-700"
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <div className="py-1">
                <button
                  onClick={handleRemoveWidget}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#111827] hover:text-white"
                >
                  Remove Widget
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
} 