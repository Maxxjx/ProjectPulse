import { NextRequest, NextResponse } from 'next/server';
import { userService } from '@/lib/data/mockDataService';
import { z } from 'zod';

// Validation schema for creating a user
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string(),
  position: z.string().optional(),
  department: z.string().optional(),
  avatar: z.string().optional(),
});

// GET all users
export async function GET(request: NextRequest) {
  try {
    const users = userService.getUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST to create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Use Zod to validate the request body
    const validationResult = createUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Check if user with email already exists
    const existingUser = userService.getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    const newUser = userService.createUser(body);
    
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 