
import { z } from 'zod';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}


import { prisma } from '@/lib/db';

export async function isPasswordInHistory(userId: string, newPassword: string): Promise<boolean> {
  const history = await prisma.passwordHistory.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5 // Check last 5 passwords
  });

  for (const record of history) {
    const isMatch = await bcrypt.compare(newPassword, record.passwordHash);
    if (isMatch) return true;
  }

  return false;
}

export async function addToPasswordHistory(userId: string, passwordHash: string) {
  try {
    // Use sequential operations to be safe if no Replica Set, though create usually fine
    await prisma.passwordHistory.create({
      data: {
        userId,
        passwordHash
      }
    });

    // Optional: Clean up old history (keep only last 5)
    const history = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: 4
    });

    if (history.length > 0) {
      await prisma.passwordHistory.deleteMany({
        where: {
          id: {
            in: history.map(h => h.id)
          }
        }
      });
    }
  } catch (err: unknown) {
    // Prisma MongoDB writes require replica set for transactions.
    // Fallback to native MongoDB writes when running standalone.
    const code =
      typeof err === 'object' && err !== null && 'code' in err
        ? (err as { code?: unknown }).code
        : undefined;

    if (code !== 'P2031') throw err;

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not initialized');
    }

    const collection = db.collection('PasswordHistory');
    const userObjectId = new ObjectId(userId);

    await collection.insertOne({
      userId: userObjectId,
      passwordHash,
      createdAt: new Date(),
    });

    const old = await collection
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .skip(5)
      .project({ _id: 1 })
      .toArray();

    if (old.length > 0) {
      await collection.deleteMany({
        _id: { $in: old.map(d => d._id) },
      });
    }
  }
}
