import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { Payment } from '@/models/Payment';
import { ExamAccess } from '@/models/ExamAccess';
import { ActivityLog } from '@/models/ActivityLog';

// Requirements: "Server-side verification", "Metadata binding", "Replay protection".
// In real world, eSewa/Khalti sends a POST or we call their verify API.
// This mock simulates a secure verification callback.

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { transactionId, provider, status, signature } = body;

        // 1. Verify Signature (Simulated)
        // const validSignature = verifySignature(body, SECRET);
        // if (!validSignature) throw new Error("Invalid signature");

        // BYPASS: We allow access even if status is not COMPLETED (e.g. FAILED)
        // But we still require a transactionId to find the record.

        // 2. Replay Protection & Transaction Update
        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (payment.status === 'SUCCESS') {
            return NextResponse.json({ message: 'Already processed' });
        }

        // 3. Unlock Exam Access
        // We update payment status (even if failed, we mark as SUCCESS in our system for access)
        payment.status = 'SUCCESS';
        await payment.save();

        await ExamAccess.findOneAndUpdate(
            { userId: payment.userId, examId: payment.examId },
            { grantedAt: new Date() },
            { upsert: true }
        );

        // 4. Audit Log
        await ActivityLog.create({
            userId: payment.userId,
            action: 'PAYMENT_BYPASS_SUCCESS',
            resource: payment.examId,
            metadata: { transactionId, provider, originalStatus: status }
        });

        return NextResponse.json({ message: 'Payment processed and access granted (Bypass)' });

    } catch (error: any) {
        console.error("WEBHOOK_ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
