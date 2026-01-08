import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation";

const MAX_FAILED_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  try {
    await dbConnect(); // Ensure DB connection
    
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Mongoose: findOne
    const user = await User.findOne({ email });

    if (!user) {
      // Return generic error to prevent enumeration
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.isLocked) {
      return NextResponse.json({ error: 'Account is locked. Contact support.' }, { status: 403 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);

    if (!isValid) {
      // Increment failed attempts
      const attempts = (user.failedLoginAttempts || 0) + 1;
      const isLocked = attempts >= MAX_FAILED_ATTEMPTS;
      
      // Update user directly
      user.failedLoginAttempts = attempts;
      user.isLocked = isLocked;
      await user.save();

      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check MFA
    if (user.mfaEnabled && user.mfaSecret) {
      if (!body.mfaCode) {
        return NextResponse.json({ 
          message: 'MFA required', 
          mfaRequired: true 
        });
      }

      const { authenticator } = await import('otplib');
      const isValidMfa = authenticator.check(body.mfaCode, user.mfaSecret);

      if (!isValidMfa) {
         // Increment failed attempts even for MFA failure? Yes, good practice.
         const attempts = (user.failedLoginAttempts || 0) + 1;
         user.failedLoginAttempts = attempts;
         if (attempts >= MAX_FAILED_ATTEMPTS) {
           user.isLocked = true;
         }
         await user.save();
         return NextResponse.json({ error: 'Invalid MFA code' }, { status: 401 });
      }
    }

    // Reset failed attempts
    if (user.failedLoginAttempts > 0) {
        user.failedLoginAttempts = 0;
        await user.save();
    }

    // Auto-heal invalid roles (e.g. typos like "Stundet")
    const VALID_ROLES = ['STUDENT', 'LECTURER', 'MODERATOR', 'ADMIN'];
    if (!VALID_ROLES.includes(user.role)) {
        await User.updateOne({ _id: user._id }, { $set: { role: 'STUDENT' } });
        user.role = 'STUDENT'; // Update local instance for session creation
    }

    // Create Session
    await createSession(user._id.toString(), user.role);

    // Log Activity
    try {
      const { prisma } = await import('@/lib/db');
      await prisma.activityLog.create({
        data: {
          userId: user._id.toString(),
          action: 'LOGIN_SUCCESS',
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          metadata: { role: user.role }
        }
      });
    } catch (logError) {
      console.error("LOGGING_ERROR", logError);
    }

    return NextResponse.json({ 
        message: 'Logged in', 
        user: { id: user._id.toString(), email: user.email, role: user.role } 
    });

  } catch (error: any) {
    console.error("LOGIN_ERROR:", error);
    // User requested not to expose internal errors
    return NextResponse.json({ error: 'Authentication failed. Please check your credentials.' }, { status: 401 });
  }
}
