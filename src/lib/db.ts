// Mock database implementation
const mockDb = {
  user: {
    findMany: async () => {
      return [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'ADMIN',
          position: 'System Administrator',
          department: 'IT',
          image: '/avatars/admin.png',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: '2',
          name: 'Team Member',
          email: 'team@example.com',
          role: 'TEAM',
          position: 'Developer',
          department: 'Engineering',
          image: '/avatars/team.png',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
          id: '3',
          name: 'Client User',
          email: 'client@example.com',
          role: 'CLIENT',
          position: 'Project Manager',
          department: 'Client Company',
          image: '/avatars/client.png',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        }
      ];
    },
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const mockUsers = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          password: '$2b$10$Rr5YfUL7SvLRbGdmzwFfce5TJL9TdW0oJDkLcjZ2z66YfcLaDJf1q', // admin123
          role: 'ADMIN',
          position: 'System Administrator',
          department: 'IT',
          image: '/avatars/admin.png',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: '2',
          name: 'Team Member',
          email: 'team@example.com',
          password: '$2b$10$5QqUXL8ZvEQTKN8Jz7xXG.LcV8UA2isXRrYFOmr6sxQo5gZDXn2WW', // team123
          role: 'TEAM',
          position: 'Developer',
          department: 'Engineering',
          image: '/avatars/team.png',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
          id: '3',
          name: 'Client User',
          email: 'client@example.com',
          password: '$2b$10$rW1SHFtDhJ3Cc92y7glRfeCDaXFP6UkQaB18JNjKnW9MhK3xZT0OS', // client123
          role: 'CLIENT',
          position: 'Project Manager',
          department: 'Client Company',
          image: '/avatars/client.png',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        }
      ];

      if (where.email) {
        return mockUsers.find(user => user.email === where.email) || null;
      } else if (where.id) {
        return mockUsers.find(user => user.id === where.id) || null;
      }
      
      return null;
    },
    create: async ({ data }: { data: any }) => {
      // In a real implementation, this would create a user in the database
      return {
        id: 'new-user-id',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    update: async ({ where, data }: { where: { id: string }, data: any }) => {
      // In a real implementation, this would update a user in the database
      return {
        id: where.id,
        ...data,
        updatedAt: new Date(),
      };
    },
    delete: async ({ where }: { where: { id: string } }) => {
      // In a real implementation, this would delete a user from the database
      return { id: where.id };
    }
  }
};

export const db = mockDb;
