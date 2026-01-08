import { cookies } from 'next/headers';
import { encrypt, decrypt } from './jwt';
import { v4 as uuidv4 } from 'uuid';
import Session from '@/models/Session';
import dbConnect from '@/lib/mongoose';

export interface SessionPayload {
  sessionId: string;
  userId: string;
  role: string;
  expiresAt: Date;
}

const SESSION_DURATION = 60 * 60 * 1000; // 1 hr

export async function createSession(userId: string, role: string) {
  await dbConnect(); // Ensure DB is connected
  
  const sessionId = uuidv4();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  // 1. Create in DB (Mongoose)
  await Session.create({
    token: sessionId,
    userId: userId, // Ensure userId is string or ObjectId matches
    expiresAt,
  });

  // 2. Create JWT
  const sessionToken = await encrypt({ sessionId, userId, role, expiresAt });

  // 3. Set Cookie
  const cookieStore = await cookies();
  cookieStore.set('session', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;

  try {
    const payload = await decrypt(sessionToken);
    return payload as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
    
  if (sessionToken) {
      try {
          await dbConnect();
          const payload = await decrypt(sessionToken);
          await Session.deleteOne({ token: payload.sessionId });
      } catch (e) {}
  }

  cookieStore.delete('session');
}
