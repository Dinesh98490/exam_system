import { prisma } from '@/lib/db';

export async function logActivity(userId: string | null, action: string, resource: string | null, metadata: any = null, ipAddress: string | null = null) {
  try {
    // Fire and forget logging to avoid blocking main thread? 
    // In serverless, we must await.
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        resource,
        metadata,
        ipAddress
      }
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
