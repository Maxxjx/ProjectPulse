'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    lastActive: '2023-07-15T10:30:00Z',
    projects: 5,
    tasks: 12
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'team',
    status: 'active',
    lastActive: '2023-07-14T16:45:00Z',
    projects: 3,
    tasks: 8
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'team',
    status: 'active',
    lastActive: '2023-07-15T09:15:00Z',
    projects: 2,
    tasks: 15
  },
  {
    id: 4,
    name: 'Emily Taylor',
    email: 'emily@example.com',
    role: 'team',
    status: 'inactive',
    lastActive: '2023-07-10T11:20:00Z',
    projects: 1,
    tasks: 5
  },
  {
    id: 5,
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'client',
    status: 'active',
    lastActive: '2023-07-13T14:30:00Z',
    projects: 2,
    tasks: 0
  },
  {
    id: 6,
    name: 'Lisa Brown',
    email: 'lisa@example.com',
    role: 'client',
    status: 'active',
    lastActive: '2023-07-12T10:00:00Z',
    projects: 1,
    tasks: 0
  }
];

export default function UserManagementView() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Redirect if not admin
  if (session?.user?.role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Filter users based on search term, role, and status
  const filteredUsers = sampleUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter.toLowerCase();
    
    return matchesSearch && matchesRole && matchesStatus;
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

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-500';
      case 'team':
        return 'bg-blue-500/20 text-blue-500';
      case 'client':
        return 'bg-green-500/20 text-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-500';
      case 'inactive':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddUserModal(true)}
          className="bg-[#8B5CF6] hover:bg-opacity-90 transition px-4 py-2 rounded text-white flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#111827] p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-400 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email"
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-400 mb-1">
              Role
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option>All</option>
              <option>Admin</option>
              <option>Team</option>
              <option>Client</option>
            </select>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-[#1F2937] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#111827] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#1F2937]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Projects
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tasks
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1F2937]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.projects}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.tasks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-[#8B5CF6] hover:text-[#A78BFA] mr-4"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal - In a real app, this would be a separate component */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="team">Team</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B5CF6] hover:bg-opacity-90 transition rounded-md"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal - In a real app, this would be a separate component */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="edit-name"
                  defaultValue={editingUser.name}
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="edit-email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="edit-email"
                  defaultValue={editingUser.email}
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="edit-role" className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <select
                  id="edit-role"
                  defaultValue={editingUser.role}
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="team">Team</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <select
                  id="edit-status"
                  defaultValue={editingUser.status}
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-password" className="block text-sm font-medium text-gray-400 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="edit-password"
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#8B5CF6] hover:bg-opacity-90 transition rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 