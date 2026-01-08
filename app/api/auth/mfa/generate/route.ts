
import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/auth/jwt';
import User from '@/models/User';
import dbConnect from '@/lib/mongoose';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await decrypt(sessionToken);
    const userId = payload.sub || payload.id; // Support both sub and id

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(user.email, 'ExamPortal', secret);
    const imageUrl = await qrcode.toDataURL(otpauth);

    // Save secret temporarily or return it? 
    // Usually we don't save it as 'enabled' yet. 
    // We can save it in a temporary field or just return it and verify in next step.
    // Ideally we save it to the user record but mark mfaEnabled = false.
    
    user.mfaSecret = secret;
    // user.mfaEnabled = false; // logic: enabled only after verification
    await user.save();

    return NextResponse.json({ secret, qrCode: imageUrl });

  } catch (error: any) {
    console.error("MFA_GENERATE_ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
