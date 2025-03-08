'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Sample ticket data
const sampleTickets = [
  {
    id: 1,
    title: 'Login issues on mobile application',
    status: 'Open',
    priority: 'High',
    createdAt: '2023-07-10T15:30:00Z',
    updatedAt: '2023-07-10T16:45:00Z',
    projectName: 'Mobile App Development',
    responses: 2
  },
  {
    id: 2,
    title: 'Need additional features for admin panel',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2023-07-08T09:15:00Z',
    updatedAt: '2023-07-10T14:20:00Z',
    projectName: 'Website Redesign',
    responses: 3
  },
  {
    id: 3,
    title: 'Reporting dashboard data not loading',
    status: 'Resolved',
    priority: 'High',
    createdAt: '2023-07-01T11:30:00Z',
    updatedAt: '2023-07-05T13:45:00Z',
    projectName: 'Website Redesign',
    responses: 5
  },
  {
    id: 4,
    title: 'Account creation error for new users',
    status: 'Open',
    priority: 'Urgent',
    createdAt: '2023-07-09T10:20:00Z',
    updatedAt: '2023-07-09T11:45:00Z',
    projectName: 'Mobile App Development',
    responses: 1
  },
  {
    id: 5,
    title: 'Request for timeline extension',
    status: 'In Progress',
    priority: 'Low',
    createdAt: '2023-07-05T16:30:00Z',
    updatedAt: '2023-07-07T09:15:00Z',
    projectName: 'Marketing Campaign',
    responses: 4
  }
];

export default function TicketsListView() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Filter tickets based on search term, status, and priority
  const filteredTickets = sampleTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        ticket.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-500/20 text-blue-500';
      case 'In Progress':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Resolved':
        return 'bg-green-500/20 text-green-500';
      case 'Closed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500/20 text-red-500';
      case 'High':
        return 'bg-orange-500/20 text-orange-500';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Low':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <Link
          href="/dashboard/tickets/new"
          className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white text-sm inline-flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create New Ticket
        </Link>
      </div>
      
      {/* Filters */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
              Search Tickets
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or project..."
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option>All</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-400 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option>All</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tickets List */}
      <div className="bg-[#111827] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1F2937]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ticket
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-[#1F2937]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium">{ticket.title}</div>
                        {ticket.responses > 0 && (
                          <span className="ml-2 bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs px-2 py-0.5 rounded-full">
                            {ticket.responses} {ticket.responses === 1 ? 'response' : 'responses'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ticket.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/tickets/${ticket.id}`}
                        className="text-[#8B5CF6] hover:text-[#A78BFA]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                    No tickets found matching your search criteria.
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