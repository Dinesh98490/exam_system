import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation";

const MAX_FAILED_ATTEMPTS = 5;


// login route handler
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

    // Send OTP instead of creating session immediately
    const { generateOTP, sendOTP } = await import('@/lib/email');
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save OTP to user document
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP via email
    try {
      await sendOTP(user.email, otp, user.name);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Clear OTP if email fails
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return NextResponse.json({ error: 'Failed to send verification email. Please try again.' }, { status: 500 });
    }

    // Log OTP sent activity
    try {
      await ActivityLog.create({
        userId: user._id.toString(),
        action: 'OTP_SENT',
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        metadata: { email: user.email }
      });
    } catch (logError) {
      console.error("LOGGING_ERROR", logError);
    }

    return NextResponse.json({
      message: 'Verification code sent to your email',
      otpRequired: true,
      email: user.email
    });



  } catch (error: any) {
    console.error("LOGIN_ERROR:", error);
    // User requested not to expose internal errors
    return NextResponse.json({ error: 'Authentication failed. Please check your credentials.' }, { status: 401 });
  }
}
