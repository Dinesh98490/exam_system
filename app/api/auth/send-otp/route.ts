import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { ActivityLog } from "@/models/ActivityLog";
import { generateOTP, sendOTP } from "@/lib/email";

const OTP_EXPIRY_MINUTES = 5;

/**
 * Send OTP to user's email
 * POST /api/auth/send-otp
 */
export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not for security
            return NextResponse.json({ error: 'If this email is registered, an OTP has been sent.' }, { status: 200 });
        }

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

        // Save OTP to user document
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        try {
            await sendOTP(email, otp, user.name);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Clear OTP if email fails
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            return NextResponse.json({ error: 'Failed to send verification email. Please try again.' }, { status: 500 });
        }

        // Log activity
        try {
            await ActivityLog.create({
                userId: user._id.toString(),
                action: 'OTP_SENT',
                ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
                metadata: { email }
            });
        } catch (logError) {
            console.error("LOGGING_ERROR", logError);
        }

        return NextResponse.json({
            message: 'Verification code sent to your email',
            expiresIn: OTP_EXPIRY_MINUTES * 60 // seconds
        });

    } catch (error: any) {
        console.error("SEND_OTP_ERROR:", error);
        return NextResponse.json({ error: 'Failed to send verification code. Please try again.' }, { status: 500 });
    }
}
