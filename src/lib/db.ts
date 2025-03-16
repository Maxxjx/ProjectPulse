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
  },
  
  // Add project model
  project: {
    findMany: async () => {
      return [
        {
          id: '1',
          name: 'Website Redesign',
          description: 'Redesign the company website',
          status: 'In Progress',
          clientId: '3',
          startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
          budget: 5000,
          spent: 2500,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        },
        {
          id: '2',
          name: 'Mobile App Development',
          description: 'Develop a mobile app for clients',
          status: 'Completed',
          clientId: '3',
          startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          budget: 10000,
          spent: 9800,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        },
        {
          id: '3',
          name: 'Database Migration',
          description: 'Migrate the database to a new server',
          status: 'Not Started',
          clientId: '3',
          startDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
          budget: 3000,
          spent: 0,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        }
      ];
    }
  },
  
  // Add task model
  task: {
    findMany: async () => {
      return [
        {
          id: '1',
          title: 'Design Homepage',
          description: 'Create a new design for the homepage',
          status: 'Completed',
          projectId: '1',
          assigneeId: '2',
          priority: 'High',
          deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        },
        {
          id: '2',
          title: 'Develop Backend API',
          description: 'Create RESTful APIs for the website',
          status: 'In Progress',
          projectId: '1',
          assigneeId: '2',
          priority: 'High',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        },
        {
          id: '3',
          title: 'Test Mobile App',
          description: 'Test the mobile app on various devices',
          status: 'Completed',
          projectId: '2',
          assigneeId: '2',
          priority: 'Medium',
          deadline: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        },
        {
          id: '4',
          title: 'Plan Database Migration',
          description: 'Create a plan for the database migration',
          status: 'Not Started',
          projectId: '3',
          assigneeId: '1',
          priority: 'Low',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        }
      ];
    }
  }
};

export const db = mockDb;
