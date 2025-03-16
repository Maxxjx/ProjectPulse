'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { DashboardFilters } from '@/components/dashboard/DashboardFilters';
import { Card, CardContent } from '@/components/ui/card';

// User type definition
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  lastActive?: string;
  projects?: number;
  tasks?: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function UserManagementView() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [departments, setDepartments] = useState<any[]>([]);
  
  // Advanced filter state
  const [filters, setFilters] = useState({
    departmentId: '',
    status: '',
    role: ''
  });
  
  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        // Ensure data is always an array
        const usersData = Array.isArray(data) ? data : (data.users || []);
        
        // Get project and task counts for each user
        const usersWithStats = await Promise.all(
          usersData.map(async (user: any) => {
            if (!user?.id) {
              console.error('Invalid user data:', user);
              return null;
            }
            
            try {
              // Get projects for this user
              const projectsResponse = await fetch(`/api/projects?userId=${user.id}`);
              const projectsData = projectsResponse.ok ? await projectsResponse.json() : { projects: [] };
              const projects = Array.isArray(projectsData) ? projectsData : (projectsData.projects || []);
              
              // Get tasks for this user
              const tasksResponse = await fetch(`/api/tasks?assignedTo=${user.id}`);
              const tasksData = tasksResponse.ok ? await tasksResponse.json() : { tasks: [] };
              const tasks = Array.isArray(tasksData) ? tasksData : (tasksData.tasks || []);
              
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: typeof user.role === 'string' ? user.role.toLowerCase() : 'team',
                status: user.status || 'active',
                lastActive: user.updatedAt || user.createdAt,
                projects: projects.length,
                tasks: tasks.length,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              };
            } catch (error) {
              console.error(`Error fetching stats for user ${user.id}:`, error);
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: typeof user.role === 'string' ? user.role.toLowerCase() : 'team',
                status: 'active',
                lastActive: user.updatedAt || user.createdAt,
                projects: 0,
                tasks: 0,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
              };
            }
          }) : []
        );
        
        // Filter out null values and set users
        setUsers(usersWithStats.filter((user): user is User => user !== null));
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users. Using fallback data.');
        
        // Fallback mock data in case of failure
        setUsers([
          {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            status: 'active',
            lastActive: new Date().toISOString(),
            projects: 5,
            tasks: 8,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Team Member',
            email: 'team@example.com',
            role: 'team',
            status: 'active',
            lastActive: new Date().toISOString(),
            projects: 3,
            tasks: 12,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Fetch departments for filter dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (response.ok) {
          const data = await response.json();
          // Format departments for dropdown
          const formattedDepartments = data.map((dept: any) => ({
            id: dept.id.toString(),
            name: dept.name
          }));
          setDepartments(formattedDepartments);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback mock data
        setDepartments([
          { id: '1', name: 'Engineering' },
          { id: '2', name: 'Design' },
          { id: '3', name: 'Marketing' },
          { id: '4', name: 'Human Resources' }
        ]);
      }
    };
    
    fetchDepartments();
  }, []);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'team'
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({
    password: ''
  });

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

  // Handler for adding a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (newUser.password.length < 6) {
      setErrors({
        password: 'Password must be at least 6 characters'
      });
      return; // Stop form submission if validation fails
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      toast.success('User created successfully!');
      setShowAddUserModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'team'
      });
      
      // Reset any errors
      setErrors({
        password: ''
      });
      
      // Fetch updated users list instead of full page refresh
      const Userresponse = await fetch('/api/users');
      if (Userresponse.ok) {
        const updatedData = await Userresponse.json();
        const updatedUsers = Array.isArray(updatedData) ? updatedData : (updatedData.users || []);
        const formattedUsers = updatedUsers.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: 'active',
          lastActive: user.updatedAt || user.createdAt,
          projects: 0,
          tasks: 0,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }));
        setUsers(formattedUsers);
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }
      
      toast.success('User deleted successfully!');
      
      // Update the users list
      setUsers(users.filter(user => user.id !== userId));
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    }
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    if (!user) return false;
    
    // Text search - handle potential undefined values
    const matchesSearch = !searchTerm || 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Normalize role and status values
    const userRole = (user.role || '').toLowerCase();
    const userStatus = (user.status || 'active').toLowerCase();
    
    // Role filter - use either advanced or legacy filter
    const targetRole = (filters.role || roleFilter || '').toLowerCase();
    const matchesRole = !targetRole || targetRole === 'all' || userRole === targetRole;
    
    // Status filter - use either advanced or legacy filter
    const targetStatus = (filters.status || statusFilter || '').toLowerCase();
    const matchesStatus = !targetStatus || targetStatus === 'all' || userStatus === targetStatus;
    
    // Department filter
    const matchesDepartment = !filters.departmentId || 
      (user.departmentId?.toString() === filters.departmentId);
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // Handle filter changes from the DashboardFilters component
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // Optional: sync with legacy filters for backward compatibility
    if (newFilters.role) {
      setRoleFilter(newFilters.role === 'all' ? 'All' : newFilters.role);
    }
    
    if (newFilters.status) {
      setStatusFilter(newFilters.status === 'all' ? 'All' : newFilters.status);
    }
  };

  // Sort users by name
  const sortedUsers = [...filteredUsers].sort((a, b) => a.name.localeCompare(b.name));

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

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

      {/* Advanced Filters using DashboardFilters component */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-4">Filter Users</h2>
          <DashboardFilters
            statuses={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            departments={departments}
            onFilterChange={handleFilterChange}
            customFilterOptions={{
              roles: [
                { value: 'all', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'team', label: 'Team Member' },
                { value: 'client', label: 'Client' }
              ]
            }}
            showDateFilter={false}
            showProjectFilter={false}
          />
        </CardContent>
      </Card>

      {/* Active filters indicator */}
      {(filters.role || filters.status || filters.departmentId) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex items-center text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          <span className="text-blue-700 dark:text-blue-300">
            Filtered by: {[
              filters.role && `role (${filters.role})`,
              filters.status && `status (${filters.status})`,
              filters.departmentId && 'department'
            ].filter(Boolean).join(', ')}
          </span>
        </div>
      )}

      {/* Legacy Filters (can be hidden with a flag in production) */}
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
              onChange={(e) => {
                setRoleFilter(e.target.value);
                // Sync with advanced filters
                setFilters({
                  ...filters,
                  role: e.target.value === 'All' ? '' : e.target.value.toLowerCase()
                });
              }}
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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                // Sync with advanced filters
                setFilters({
                  ...filters,
                  status: e.target.value === 'All' ? '' : e.target.value.toLowerCase()
                });
              }}
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
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#8B5CF6] mr-2"></div>
                      <span className="text-gray-400">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
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
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status || 'active')}`}>
                        {(user.status || 'active').charAt(0).toUpperCase() + (user.status || 'active').slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(user.lastActive || user.createdAt || new Date().toISOString())}
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
                        onClick={() => handleDeleteUser(user.id)}
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

      {/* Pagination Controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-[#1F2937] border border-gray-700 disabled:opacity-50"
          >
            &laquo; Prev
          </button>
          
          <span className="px-3 py-1 text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-[#1F2937] border border-gray-700 disabled:opacity-50"
          >
            Next &raquo;
          </button>
        </div>
      )}

      {/* Add User Modal - In a real app, this would be a separate component */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1F2937] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form className="space-y-4" onSubmit={handleAddUser}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
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
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  className="w-full px-4 py-2 rounded-md bg-[#111827] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
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
                  className={`w-full px-4 py-2 rounded-md bg-[#111827] border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent`}
                  value={newUser.password}
                  onChange={(e) => {
                    setNewUser({...newUser, password: e.target.value});
                    // Clear error when user types
                    if (e.target.value.length >= 6) {
                      setErrors({...errors, password: ''});
                    }
                  }}
                  required
                  minLength={6}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
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
                  className="px-4 py-2 bg-[#8B5CF6] hover:bg-opacity-90 transition rounded-md flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Add User'
                  )}
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
            <form className="space-y-4" onSubmit={handleAddUser}>
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