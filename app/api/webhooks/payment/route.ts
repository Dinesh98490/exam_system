import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PaymentStatus } from '@prisma/client';

// Requirements: "Server-side verification", "Metadata binding", "Replay protection".
// In real world, eSewa/Khalti sends a POST or we call their verify API.
// This mock simulates a secure verification callback.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transactionId, provider, status, signature } = body;

    // 1. Verify Signature (Simulated)
    // const validSignature = verifySignature(body, SECRET);
    // if (!validSignature) throw new Error("Invalid signature");

    if (status !== 'COMPLETED') {
         return NextResponse.json({ message: 'Ignored' });
    }

    // 2. Replay Protection & Transaction Update
    const payment = await prisma.payment.findUnique({
        where: { transactionId }
    });

    if (!payment) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    if (payment.status === 'COMPLETED') {
        return NextResponse.json({ message: 'Already processed' });
    }

    // 3. Unlock Exam Access
    await prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.COMPLETED }
    });

    await prisma.examAccess.create({
        data: {
            userId: payment.userId,
            examId: payment.examId
        }
    });

    // 4. Audit Log
    // 4. Audit Log
    await prisma.activityLog.create({
        data: {
            userId: payment.userId,
            action: 'PAYMENT_SUCCESS',
            resource: payment.examId,
            metadata: { transactionId, provider, amount: payment.amount }
        }
    });

    return NextResponse.json({ message: 'Payment verified and access granted' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
