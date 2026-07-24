export type RoleName = 
  | 'STUDENT'
  | 'PREMIUM_STUDENT'
  | 'INSTRUCTOR'
  | 'MODERATOR'
  | 'ADMIN'
  | 'SUPER_ADMIN'
  | 'student'
  | 'premium_student'
  | 'instructor'
  | 'moderator'
  | 'admin'
  | 'super_admin';

export const ROLE_HIERARCHY: Record<string, number> = {
  student: 1,
  STUDENT: 1,
  premium_student: 2,
  PREMIUM_STUDENT: 2,
  instructor: 3,
  INSTRUCTOR: 3,
  moderator: 4,
  MODERATOR: 4,
  admin: 5,
  ADMIN: 5,
  super_admin: 6,
  SUPER_ADMIN: 6,
};

export const PERMISSIONS = {
  VIEW_CONTENT: 'view:content',
  PRACTICE_BASIC: 'practice:basic',
  PRACTICE_PREMIUM: 'practice:premium',
  UPLOAD_RESUME: 'upload:resume',
  GENERATE_CERTIFICATE: 'generate:certificate',
  CREATE_LESSON: 'create:lesson',
  MODERATE_COMMUNITY: 'moderate:community',
  MANAGE_USERS: 'manage:users',
  MANAGE_SYSTEM: 'manage:system',
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: [PERMISSIONS.VIEW_CONTENT, PERMISSIONS.PRACTICE_BASIC, PERMISSIONS.UPLOAD_RESUME, PERMISSIONS.GENERATE_CERTIFICATE],
  STUDENT: [PERMISSIONS.VIEW_CONTENT, PERMISSIONS.PRACTICE_BASIC, PERMISSIONS.UPLOAD_RESUME, PERMISSIONS.GENERATE_CERTIFICATE],
  
  premium_student: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.PRACTICE_BASIC,
    PERMISSIONS.PRACTICE_PREMIUM,
    PERMISSIONS.UPLOAD_RESUME,
    PERMISSIONS.GENERATE_CERTIFICATE,
  ],
  PREMIUM_STUDENT: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.PRACTICE_BASIC,
    PERMISSIONS.PRACTICE_PREMIUM,
    PERMISSIONS.UPLOAD_RESUME,
    PERMISSIONS.GENERATE_CERTIFICATE,
  ],
  
  instructor: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.PRACTICE_BASIC,
    PERMISSIONS.PRACTICE_PREMIUM,
    PERMISSIONS.UPLOAD_RESUME,
    PERMISSIONS.GENERATE_CERTIFICATE,
    PERMISSIONS.CREATE_LESSON,
  ],
  INSTRUCTOR: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.PRACTICE_BASIC,
    PERMISSIONS.PRACTICE_PREMIUM,
    PERMISSIONS.UPLOAD_RESUME,
    PERMISSIONS.GENERATE_CERTIFICATE,
    PERMISSIONS.CREATE_LESSON,
  ],
  
  moderator: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.PRACTICE_BASIC,
    PERMISSIONS.PRACTICE_PREMIUM,
    PERMISSIONS.MODERATE_COMMUNITY,
  ],
  MODERATOR: [
    PERMISSIONS.VIEW_CONTENT,
    PERMISSIONS.PRACTICE_BASIC,
    PERMISSIONS.PRACTICE_PREMIUM,
    PERMISSIONS.MODERATE_COMMUNITY,
  ],
  
  admin: Object.values(PERMISSIONS),
  ADMIN: Object.values(PERMISSIONS),
  
  super_admin: Object.values(PERMISSIONS),
  SUPER_ADMIN: Object.values(PERMISSIONS),
};

export function normalizeRole(role?: string): string {
  if (!role) return 'student';
  return role.toLowerCase();
}

export function hasRole(userRole: string | undefined, requiredRole: RoleName): boolean {
  const normUser = normalizeRole(userRole);
  const normRequired = normalizeRole(requiredRole);

  const userLevel = ROLE_HIERARCHY[normUser] || 1;
  const requiredLevel = ROLE_HIERARCHY[normRequired] || 1;

  return userLevel >= requiredLevel;
}

export function hasPermission(userRole: string | undefined, permission: string): boolean {
  const normUser = normalizeRole(userRole);
  const allowedPermissions = ROLE_PERMISSIONS[normUser] || ROLE_PERMISSIONS['student'];
  return allowedPermissions.includes(permission);
}
