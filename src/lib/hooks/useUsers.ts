'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@/lib/data/types';
import { v4 as uuidv4 } from 'uuid';

// Mock users data as fallback
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    position: 'System Administrator',
    department: 'IT',
    avatar: '/avatars/admin.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '2',
    name: 'Team Member',
    email: 'team@example.com',
    role: UserRole.TEAM,
    position: 'Developer',
    department: 'Engineering',
    avatar: '/avatars/team.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '3',
    name: 'Client User',
    email: 'client@example.com',
    role: UserRole.CLIENT,
    position: 'Project Manager',
    department: 'Client Company',
    avatar: '/avatars/client.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  }
];

// GET all users
export function useUsers(role?: string) {
  const queryParams = new URLSearchParams();
  if (role) queryParams.append('role', role);
  
  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return useQuery({
    queryKey: ['users', { role }],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users${queryStr}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        const data = await response.json();
        return data.users;
      } catch (error) {
        console.warn('Falling back to mock data for users:', error);
        // Fallback to mock data
        if (role) {
          return mockUsers.filter(user => user.role === role);
        }
        return mockUsers;
      }
    }
  });
}

// GET single user
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('API error');
        }
        const data = await response.json();
        return data.user;
      } catch (error) {
        console.warn('Falling back to mock data for user:', error);
        // Fallback to mock data
        const user = mockUsers.find(user => user.id === id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      }
    },
    enabled: !!id
  });
}

// POST create user
export function useCreateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        return data.user;
      } catch (error) {
        console.warn('Falling back to mock data for creating user:', error);
        // Fallback to mock implementation
        const newUser: User = {
          id: uuidv4(),
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to mock data
        mockUsers.push(newUser);
        
        return newUser;
      }
    },
    onSuccess: () => {
      // Invalidate users query to refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// PATCH update user
export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: Partial<User>) => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          throw new Error('API error');
        }
        
        const data = await response.json();
        return data.user;
      } catch (error) {
        console.warn('Falling back to mock data for updating user:', error);
        // Fallback to mock implementation
        const userIndex = mockUsers.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        
        // Update the user
        const updatedUser: User = {
          ...mockUsers[userIndex],
          ...userData,
          updatedAt: new Date().toISOString()
        };
        
        // Update in mock data
        mockUsers[userIndex] = updatedUser;
        
        return updatedUser;
      }
    },
    onSuccess: (updatedUser) => {
      // Update cache for the individual user
      queryClient.setQueryData(['users', id], updatedUser);
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
}

// DELETE user
export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('API error');
        }
        
        return { id };
      } catch (error) {
        console.warn('Falling back to mock data for deleting user:', error);
        // Fallback to mock implementation
        const userIndex = mockUsers.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          throw new Error('User not found');
        }
        
        // Remove from mock data
        mockUsers.splice(userIndex, 1);
        
        return { id };
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch users queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.removeQueries({ queryKey: ['users', variables.id] });
    }
  });
}
