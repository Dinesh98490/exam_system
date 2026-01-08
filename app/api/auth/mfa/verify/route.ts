
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/jwt';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';
import { z } from 'zod';

const verifySchema = z.object({
  token: z.string().min(6).max(6),
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);
    const userId = payload.sub || payload.id;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.mfaSecret) {
      return NextResponse.json({ error: 'MFA not initialized' }, { status: 400 });
    }

    const body = await req.json();
    const { token } = verifySchema.parse(body);

    const isValid = authenticator.check(token, user.mfaSecret);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    user.mfaEnabled = true;
    await user.save();

    return NextResponse.json({ message: 'MFA enabled successfully' });

  } catch (error: any) {
    console.error("MFA_VERIFY_ERROR:", error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
