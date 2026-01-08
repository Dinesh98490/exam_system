import { Role } from '@prisma/client';
import { getSession } from './auth/session';
import { hasRole } from './rbac-definitions';

export { hasRole, ROLES_HIERARCHY } from './rbac-definitions';

export async function authorize(requiredRole: Role) {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized: No session found');
  }
  
  // Cast Prisma Role to Local Role (values are identical strings)
  if (!hasRole(session.role as unknown as any, requiredRole as unknown as any)) {
    throw new Error(`Forbidden: Insufficient permissions. Required ${requiredRole}, got ${session.role}`);
  }
  
  return session;
}
