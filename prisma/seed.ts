import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding with Indian context data...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.timeEntry.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Seed users with Indian names
  console.log('Seeding users...');
  
  // Admin user
  const adminPassword = await hash('admin1234', 10);
  const adminUser = await prisma.user.create({
    data: {
      id: '1',
      name: 'Rajesh Sharma',
      email: 'admin@projectpulse.com',
      password: adminPassword,
      role: 'ADMIN',
      position: 'Project Director',
      department: 'Management',
      avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
      createdAt: new Date('2023-12-15'),
      updatedAt: new Date('2023-12-15'),
    },
  });

  // Team members
  const teamPassword = await hash('team1234', 10);
  const teamUser1 = await prisma.user.create({
    data: {
      id: '2',
      name: 'Priya Patel',
      email: 'priya@projectpulse.com',
      password: teamPassword,
      role: 'TEAM',
      position: 'Senior Developer',
      department: 'Engineering',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      createdAt: new Date('2023-12-16'),
      updatedAt: new Date('2023-12-16'),
    },
  });

  const teamUser2 = await prisma.user.create({
    data: {
      id: '3',
      name: 'Vikram Singh',
      email: 'vikram@projectpulse.com',
      password: teamPassword,
      role: 'TEAM',
      position: 'UI/UX Designer',
      department: 'Design',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      createdAt: new Date('2023-12-18'),
      updatedAt: new Date('2023-12-18'),
    },
  });

  const teamUser3 = await prisma.user.create({
    data: {
      id: '4',
      name: 'Ananya Desai',
      email: 'ananya@projectpulse.com',
      password: teamPassword,
      role: 'TEAM',
      position: 'QA Engineer',
      department: 'Quality Assurance',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      createdAt: new Date('2023-12-19'),
      updatedAt: new Date('2023-12-19'),
    },
  });

  // Client users
  const clientPassword = await hash('client1234', 10);
  const clientUser1 = await prisma.user.create({
    data: {
      id: '5',
      name: 'Arjun Mehta',
      email: 'arjun@tataprojects.com',
      password: clientPassword,
      role: 'CLIENT',
      position: 'CTO',
      department: 'Executive',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: new Date('2023-12-20'),
      updatedAt: new Date('2023-12-20'),
    },
  });

  const clientUser2 = await prisma.user.create({
    data: {
      id: '6',
      name: 'Deepika Reddy',
      email: 'deepika@reliancetech.com',
      password: clientPassword,
      role: 'CLIENT',
      position: 'Product Manager',
      department: 'Product',
      avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      createdAt: new Date('2023-12-21'),
      updatedAt: new Date('2023-12-21'),
    },
  });

  // Demo user
  const demoPassword = await hash('demo1234', 10);
  const demoUser = await prisma.user.create({
    data: {
      id: '7',
      name: 'Demo User',
      email: 'demo@projectpulse.com',
      password: demoPassword,
      role: 'USER',
      createdAt: new Date('2023-12-22'),
      updatedAt: new Date('2023-12-22'),
    },
  });

  // Seed projects with Indian context
  console.log('Seeding projects...');
  
  const project1 = await prisma.project.create({
    data: {
      name: 'Mumbai Metro Line Integration',
      description: 'Develop a software solution to integrate ticketing systems for the Mumbai Metro with mobile payment platforms including UPI, Paytm, and PhonePe.',
      status: 'In Progress',
      progress: 65,
      startDate: new Date('2024-01-15'),
      deadline: new Date('2024-06-30'),
      budget: 2500000,
      spent: 1625000,
      priority: 'High',
      tags: 'transportation,mobile-payments,infrastructure,mumbai',
      clientId: clientUser1.id,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-03-15'),
      team: {
        connect: [
          { id: teamUser1.id },
          { id: teamUser2.id }
        ]
      }
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'SmartFarmer Agricultural App',
      description: 'Create a mobile application to help farmers across rural India get real-time weather forecasts, crop pricing information, and government scheme updates in 12 regional languages.',
      status: 'In Progress',
      progress: 40,
      startDate: new Date('2024-02-01'),
      deadline: new Date('2024-08-15'),
      budget: 1800000,
      spent: 720000,
      priority: 'Medium',
      tags: 'agriculture,rural-tech,mobile-app,multilingual',
      clientId: clientUser2.id,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-20'),
      team: {
        connect: [
          { id: teamUser2.id },
          { id: teamUser3.id }
        ]
      }
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Aadhaar Integration System',
      description: 'Develop an API framework to securely integrate Aadhaar verification into enterprise applications while ensuring compliance with privacy regulations.',
      status: 'Not Started',
      progress: 0,
      startDate: new Date('2024-04-01'),
      deadline: new Date('2024-09-30'),
      budget: 3200000,
      spent: 0,
      priority: 'High',
      tags: 'aadhaar,security,compliance,api',
      clientId: clientUser1.id,
      createdAt: new Date('2024-03-15'),
      updatedAt: new Date('2024-03-15'),
      team: {
        connect: [
          { id: teamUser1.id }
        ]
      }
    },
  });

  // Seed tasks
  console.log('Seeding tasks...');
  
  // Project 1 Tasks
  const task1_1 = await prisma.task.create({
    data: {
      title: 'UPI Payment Gateway Integration',
      description: 'Implement integration with major UPI providers including BHIM, Google Pay, and PhonePe for the Mumbai Metro ticketing system.',
      status: 'In Progress',
      priority: 'High',
      deadline: new Date('2024-04-15'),
      estimatedHours: 40,
      actualHours: 25,
      tags: 'payment-gateway,upi,integration',
      projectId: project1.id,
      assigneeId: teamUser1.id,
      creatorId: adminUser.id,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-10'),
    },
  });

  const task1_2 = await prisma.task.create({
    data: {
      title: 'Design Metro Pass QR Code System',
      description: 'Create a secure QR code system for digital metro passes that can be scanned at entry gates.',
      status: 'Completed',
      priority: 'Medium',
      deadline: new Date('2024-03-01'),
      estimatedHours: 25,
      actualHours: 22,
      tags: 'qr-code,security,design',
      projectId: project1.id,
      assigneeId: teamUser2.id,
      creatorId: adminUser.id,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-01'),
    },
  });

  const task1_3 = await prisma.task.create({
    data: {
      title: 'User Testing at Andheri Station',
      description: 'Conduct user testing of the mobile payment system with real commuters at Andheri Metro Station.',
      status: 'Not Started',
      priority: 'Medium',
      deadline: new Date('2024-05-10'),
      estimatedHours: 15,
      actualHours: 0,
      tags: 'testing,user-experience',
      projectId: project1.id,
      assigneeId: teamUser3.id,
      creatorId: adminUser.id,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
  });

  // Project 2 Tasks
  const task2_1 = await prisma.task.create({
    data: {
      title: 'Hindi Language Implementation',
      description: 'Implement Hindi language support in the SmartFarmer app, including all UI elements and content.',
      status: 'Completed',
      priority: 'High',
      deadline: new Date('2024-03-15'),
      estimatedHours: 30,
      actualHours: 28,
      tags: 'localization,hindi,ui',
      projectId: project2.id,
      assigneeId: teamUser2.id,
      creatorId: adminUser.id,
      createdAt: new Date('2024-02-05'),
      updatedAt: new Date('2024-03-14'),
    },
  });

  const task2_2 = await prisma.task.create({
    data: {
      title: 'Mandi Price API Integration',
      description: 'Integrate with government Mandi price APIs to provide real-time crop price information to farmers.',
      status: 'In Progress',
      priority: 'High',
      deadline: new Date('2024-04-20'),
      estimatedHours: 35,
      actualHours: 20,
      tags: 'api,pricing,data-integration',
      projectId: project2.id,
      assigneeId: teamUser1.id,
      creatorId: adminUser.id,
      createdAt: new Date('2024-02-25'),
      updatedAt: new Date('2024-03-18'),
    },
  });

  // Seed comments
  console.log('Seeding comments...');
  
  await prisma.comment.create({
    data: {
      text: 'I have completed the integration with Google Pay. BHIM and PhonePe are still in progress.',
      taskId: task1_1.id,
      userId: teamUser1.id,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15'),
    },
  });

  await prisma.comment.create({
    data: {
      text: 'We need to make sure the payment confirmation messages are sent in both English and Hindi.',
      taskId: task1_1.id,
      userId: adminUser.id,
      createdAt: new Date('2024-02-16'),
      updatedAt: new Date('2024-02-16'),
    },
  });

  await prisma.comment.create({
    data: {
      text: 'The QR code system has been tested on test gates and is working properly.',
      taskId: task1_2.id,
      userId: teamUser2.id,
      createdAt: new Date('2024-02-28'),
      updatedAt: new Date('2024-02-28'),
    },
  });

  await prisma.comment.create({
    data: {
      text: 'Hindi implementation is complete. We should start working on Tamil and Telugu translations next.',
      taskId: task2_1.id,
      userId: teamUser2.id,
      createdAt: new Date('2024-03-14'),
      updatedAt: new Date('2024-03-14'),
    },
  });

  // Seed time entries
  console.log('Seeding time entries...');
  
  await prisma.timeEntry.create({
    data: {
      description: 'Implemented Google Pay integration',
      minutes: 360, // 6 hours
      date: new Date('2024-02-10'),
      taskId: task1_1.id,
      userId: teamUser1.id,
      createdAt: new Date('2024-02-10'),
    },
  });

  await prisma.timeEntry.create({
    data: {
      description: 'Testing UPI transaction flow',
      minutes: 240, // 4 hours
      date: new Date('2024-02-12'),
      taskId: task1_1.id,
      userId: teamUser1.id,
      createdAt: new Date('2024-02-12'),
    },
  });

  await prisma.timeEntry.create({
    data: {
      description: 'QR code encryption implementation',
      minutes: 300, // 5 hours
      date: new Date('2024-02-20'),
      taskId: task1_2.id,
      userId: teamUser2.id,
      createdAt: new Date('2024-02-20'),
    },
  });

  await prisma.timeEntry.create({
    data: {
      description: 'Hindi UI translation',
      minutes: 480, // 8 hours
      date: new Date('2024-03-01'),
      taskId: task2_1.id,
      userId: teamUser2.id,
      createdAt: new Date('2024-03-01'),
    },
  });

  // Seed notifications
  console.log('Seeding notifications...');
  
  await prisma.notification.create({
    data: {
      title: 'Task Assigned',
      message: 'You have been assigned to implement UPI Payment Gateway Integration.',
      type: 'task_assigned',
      entityType: 'task',
      entityId: task1_1.id,
      read: true,
      actionUrl: `/dashboard/tasks/${task1_1.id}`,
      createdAt: new Date('2024-01-20'),
      userId: teamUser1.id,
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Task Completed',
      message: 'QR Code System design has been marked as completed.',
      type: 'task_completed',
      entityType: 'task',
      entityId: task1_2.id,
      read: false,
      actionUrl: `/dashboard/tasks/${task1_2.id}`,
      createdAt: new Date('2024-03-01'),
      userId: adminUser.id,
    },
  });

  await prisma.notification.create({
    data: {
      title: 'Comment Added',
      message: 'Rajesh Sharma commented on UPI Payment Gateway Integration.',
      type: 'comment_added',
      entityType: 'task',
      entityId: task1_1.id,
      read: false,
      actionUrl: `/dashboard/tasks/${task1_1.id}`,
      createdAt: new Date('2024-02-16'),
      userId: teamUser1.id,
    },
  });

  // Seed activity logs
  console.log('Seeding activity logs...');
  
  await prisma.activityLog.create({
    data: {
      action: 'created',
      entityType: 'project',
      entityId: project1.id.toString(),
      entityName: 'Mumbai Metro Line Integration',
      timestamp: new Date('2024-01-10'),
      userId: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'created',
      entityType: 'task',
      entityId: task1_1.id.toString(),
      entityName: 'UPI Payment Gateway Integration',
      timestamp: new Date('2024-01-20'),
      userId: adminUser.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'completed',
      entityType: 'task',
      entityId: task1_2.id.toString(),
      entityName: 'Design Metro Pass QR Code System',
      timestamp: new Date('2024-03-01'),
      userId: teamUser2.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'updated',
      entityType: 'project',
      entityId: project1.id.toString(),
      entityName: 'Mumbai Metro Line Integration',
      details: 'Updated project progress to 65%',
      timestamp: new Date('2024-03-15'),
      userId: adminUser.id,
    },
  });

  console.log('Database seeding with Indian context completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });