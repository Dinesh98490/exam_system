import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { createSession } from "@/lib/auth/session";

const MAX_FAILED_ATTEMPTS = 5;

/**
 * Verify OTP and create session
 * POST /api/auth/verify-otp
 */
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email, otp } = body;

        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
        }

        if (user.isLocked) {
            return NextResponse.json({ error: 'Account is locked. Contact support.' }, { status: 403 });
        }

        // Check if OTP exists
        if (!user.otp || !user.otpExpiry) {
            return NextResponse.json({ error: 'No verification code found. Please request a new one.' }, { status: 400 });
        }

        // Check if OTP is expired
        if (new Date() > user.otpExpiry) {
            // Clear expired OTP
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
        }

        // Verify OTP
        if (user.otp !== otp) {
            // Increment failed attempts
            const attempts = (user.failedLoginAttempts || 0) + 1;
            const isLocked = attempts >= MAX_FAILED_ATTEMPTS;

            user.failedLoginAttempts = attempts;
            user.isLocked = isLocked;
            await user.save();

            return NextResponse.json({ error: 'Invalid verification code' }, { status: 401 });
        }

        // OTP is valid - clear it and reset failed attempts
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.failedLoginAttempts = 0;
        await user.save();

        // Auto-heal invalid roles
        const VALID_ROLES = ['STUDENT', 'LECTURER', 'MODERATOR', 'ADMIN'];
        if (!VALID_ROLES.includes(user.role)) {
            await User.updateOne({ _id: user._id }, { $set: { role: 'STUDENT' } });
            user.role = 'STUDENT';
        }

        // Create Session
        await createSession(user._id.toString(), user.role);

        // Log Activity
        try {
            await ActivityLog.create({
                userId: user._id.toString(),
                action: 'OTP_VERIFIED_LOGIN_SUCCESS',
                ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
                metadata: { role: user.role }
            });
        } catch (logError) {
            console.error("LOGGING_ERROR", logError);
        }

        return NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                name: user.name
            }
        });

    } catch (error: any) {
        console.error("VERIFY_OTP_ERROR:", error);
        return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
    }
}
