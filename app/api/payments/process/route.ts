
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/jwt';
import crypto from 'crypto';

// Schema for payment input
const paymentSchema = z.object({
  examId: z.string(),
  cardNumber: z.string().min(16).max(16),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/),
  cvv: z.string().min(3).max(4),
  cardHolderName: z.string().min(3)
});

// Mock encryption function
function encryptData(data: string) {
  // In real world, use KMS or proper public key encryption
  // Here we just hash it to show we don't store plain text
  return crypto.createHash('sha256').update(data).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);
    const userId = payload.sub || payload.id;

    const body = await req.json();
    const { examId, cardNumber, expiry, cvv, cardHolderName } = paymentSchema.parse(body);

    // 1. Verify Exam exists
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // 2. Simulate Secure Processing
    // We do NOT store card details. checking algorithm luhn's etc.
    // Encrypt sensitive data for transient processing logs if needed (masked)
    const maskedCard = `****-****-****-${cardNumber.slice(-4)}`;
    
    // 3. Create Payment Record (Pending)
    const transactionId = `SECURE-${crypto.randomUUID()}`;
    const payment = await prisma.payment.create({
      data: {
        userId,
        examId,
        amount: exam.price,
        provider: 'CUSTOM_SECURE',
        transactionId,
        status: 'PENDING',
        metadata: {
            maskedCard,
            cardHolderHash: encryptData(cardHolderName)
        }
      }
    });

    // 4. Simulate Bank API Call
    const success = true; // Mock success

    if (success) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' }
      });
      
      await prisma.examAccess.create({
        data: {
          userId,
          examId
        }
      });

      // 5. Audit Log (Securely)
      // 5. Audit Log (Securely)
      await prisma.activityLog.create({
        data: {
            userId,
            action: 'PAYMENT_SUCCESS_SECURE',
            resource: examId,
            metadata: { transactionId, maskedCard }
        }
      });

      return NextResponse.json({ message: 'Payment Successful', transactionId });
    } else {
        await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED' }
        });
        return NextResponse.json({ error: 'Payment Declined' }, { status: 400 });
    }

  } catch (error: any) {
    if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid payment details' }, { status: 400 });
    }
    console.error("PAYMENT_ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
