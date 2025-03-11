import { prisma } from '../prisma';
import { hash } from 'bcryptjs';

/**
 * Initialize the database with some basic data if it doesn't exist yet
 */
export async function initializeDatabase() {
  try {
    // Check if we already have users in the database
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      console.log('Database already initialized, skipping initialization');
      return true;
    }
    
    console.log('Initializing database with basic data...');
    
    // Create admin user
    const adminPassword = await hash('admin1234', 10);
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Admin User',
        email: 'admin@projectpulse.com',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    // Create team user
    const teamPassword = await hash('team1234', 10);
    await prisma.user.create({
      data: {
        id: '2',
        name: 'Team Member',
        email: 'team@projectpulse.com',
        password: teamPassword,
        role: 'team',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    // Create client user
    const clientPassword = await hash('client1234', 10);
    await prisma.user.create({
      data: {
        id: '3',
        name: 'Client User',
        email: 'client@projectpulse.com',
        password: clientPassword,
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    // Create demo user
    const demoPassword = await hash('demo1234', 10);
    await prisma.user.create({
      data: {
        id: '4',
        name: 'Demo User',
        email: 'demo@projectpulse.com',
        password: demoPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    console.log('Database initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
} 