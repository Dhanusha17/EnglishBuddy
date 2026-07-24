import { hasRole, hasPermission, PERMISSIONS } from '../../src/lib/rbac';

describe('RBAC Unit Tests', () => {
  it('should correctly evaluate role hierarchy', () => {
    expect(hasRole('student', 'student')).toBe(true);
    expect(hasRole('admin', 'student')).toBe(true);
    expect(hasRole('super_admin', 'admin')).toBe(true);
    expect(hasRole('student', 'admin')).toBe(false);
    expect(hasRole('instructor', 'admin')).toBe(false);
  });

  it('should grant proper permissions based on role', () => {
    expect(hasPermission('student', PERMISSIONS.VIEW_CONTENT)).toBe(true);
    expect(hasPermission('student', PERMISSIONS.PRACTICE_PREMIUM)).toBe(false);
    expect(hasPermission('premium_student', PERMISSIONS.PRACTICE_PREMIUM)).toBe(true);
    expect(hasPermission('admin', PERMISSIONS.MANAGE_SYSTEM)).toBe(true);
  });
});
