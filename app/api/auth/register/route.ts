import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { hashPassword, addToPasswordHistory } from '@/lib/auth/password';
import { registerSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure DB connection

    const body = await req.json();
    console.log("REGISTRATION_REQUEST_BODY:", body);
    const { email, password, name, role } = registerSchema.parse(body);

    // Check for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user (Mongoose handles this atomically without needing Replica Set for single doc)
    const user = await User.create({
      email,
      passwordHash: hashedPassword,
      name,
      role: role === 'LECTURER' ? 'LECTURER' : 'STUDENT',
      passwordChangedAt: new Date(),
    });

    // Add to password history
    await addToPasswordHistory(user._id.toString(), hashedPassword);

    return NextResponse.json({
      message: 'User created',
      user: { id: user._id.toString(), email: user.email, role: user.role }
    }, { status: 201 });

  } catch (error: any) {
    console.error("REGISTRATION_ERROR_LOG:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json({
        error: firstError.message || 'Validation failed',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
