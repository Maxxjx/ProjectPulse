import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/data/dataService';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { hash } from 'bcryptjs';

// Validation schema for creating a user
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().transform(val => val.toUpperCase())
    .pipe(z.enum(['ADMIN', 'TEAM', 'CLIENT'])).default('TEAM'),
});

// GET all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }

    // Check if we should use the database
    const useDb = process.env.USE_DATABASE === 'true';
    
    if (useDb) {
      // Check if the current user is an admin
      if (session.user.role !== 'ADMIN') {
        // Non-admin users can only see basic user info
        const users = await db.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
          },
        });
        return NextResponse.json(users);
      } else {
        // Admins can see all user data
        const users = await db.user.findMany();
        return NextResponse.json(users);
      }
    } else {
      // Use mock data service
      const users = await userService.getUsers();
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch users' }),
      { status: 500 }
    );
  }
}

// POST create a new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can create users
    console.log('User role from session:', session?.user?.role);
    if (!session || session.user.role?.toUpperCase() !== 'ADMIN') {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized - Admin role required' }),
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = createUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      // Log the validation error details for debugging
      console.log('Validation error details:', JSON.stringify(validationResult.error.format(), null, 2));
      console.log('Request body:', JSON.stringify(body, null, 2));
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password, role } = validationResult.data;
    
    // Check if we should use the database
    const useDb = process.env.USE_DATABASE === 'true';
    
    if (useDb) {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      const hashedPassword = await hash(password, 10);
      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      return NextResponse.json(user, { status: 201 });
    } else {
      const user = userService.createUser({
        name,
        email,
        password,
        role,
      });
      return NextResponse.json({ user }, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}