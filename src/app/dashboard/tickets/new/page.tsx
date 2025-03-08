'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

export default function NewTicketView() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [projectId, setProjectId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Sample client projects
  const clientProjects = [
    { id: '1', name: 'Website Redesign' },
    { id: '2', name: 'Mobile App Development' },
    { id: '3', name: 'Marketing Campaign' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would submit the ticket to an API
    console.log({
      title,
      description,
      priority,
      projectId,
      createdBy: session?.user?.id
    });
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link 
          href="/dashboard"
          className="text-[#8B5CF6] hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Create Support Ticket</h1>
      
      {submitted ? (
        <div className="bg-[#111827] rounded-lg p-6">
          <div className="flex items-center justify-center flex-col py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Ticket Submitted Successfully</h2>
            <p className="text-gray-400 mb-6 text-center">
              Your support ticket has been submitted. Our team will respond as soon as possible.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/dashboard"
                className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/dashboard/tickets"
                className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-sm"
              >
                View All Tickets
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#111827] rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
                Ticket Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter a brief title for your support request"
                className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-400 mb-1">
                Related Project
              </label>
              <select
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              >
                <option value="" disabled>Select a project</option>
                {clientProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-400 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                Description
              </label>
              <RichTextEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide detailed information about your issue..."
                height="200px"
              />
            </div>
            
            <div className="pt-4 flex justify-end">
              <Link
                href="/dashboard"
                className="bg-[#1F2937] border border-gray-600 hover:bg-opacity-90 transition px-4 py-2 rounded text-sm mr-3"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title || !description || !projectId}
                className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit Ticket'
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 