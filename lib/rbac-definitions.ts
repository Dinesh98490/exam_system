export enum Role {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export const ROLES_HIERARCHY: Record<Role, number> = {
  [Role.STUDENT]: 0,
  [Role.LECTURER]: 1,
  [Role.MODERATOR]: 2,
  [Role.ADMIN]: 3,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLES_HIERARCHY[userRole] >= ROLES_HIERARCHY[requiredRole];
}
