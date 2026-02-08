// src/utils/auth/roles.ts
// Roles & RBAC utilities (pure, framework-agnostic)

import type { AuthPayload } from '@/types/auth';
import type { UserRole } from '@/types/users';

/* =========================================================
   Roles & Priority
========================================================= */

export const ROLE_PRIORITY = [
  'dev',
  'admin',
  'super_admin',
  'tutor',
  'parent',
  'student',
] as const;

/* =========================================================
   Role UI Metadata
========================================================= */

export const ROLE_COLORS: Record<UserRole | 'user', string> = {
  dev: '#17a2b8',         // info
  admin: '#dc3545',        // danger
  super_admin: '#6c757d',  // secondary
  tutor: '#28a745',        // success
  parent: '#17a2b8',       // info
  student: '#007bff',      // primary
  user: '#6c757d',         // secondary
};

export const ROLE_INFO: Record<UserRole | 'user', { icon: string; color: string; label: string }> = {
  dev: { 
    icon: 'fa-code', 
    color: 'info', 
    label: 'Developer' 
  },
  student: { 
    icon: 'fa-graduation-cap', 
    color: 'secondary', 
    label: 'Student' 
  },
  parent: { 
    icon: 'fa-users', 
    color: 'info', 
    label: 'Parent' 
  },
  tutor: { 
    icon: 'fa-chalkboard-teacher', 
    color: 'success', 
    label: 'Tutor' 
  },
  admin: { 
    icon: 'fa-user-shield', 
    color: 'danger', 
    label: 'Admin' 
  },
  super_admin: {
    icon: 'fa-crown',
    color: 'secondary',
    label: 'Super Admin'
  },
  user: {
    icon: 'fa-user',
    color: 'secondary',
    label: 'User'
  }
};

/* =========================================================
   Normalization & Guards
========================================================= */

/**
 * Ensures roles coming from API/session are valid system roles.
 * Case-insensitive matching for robustness.
 */
export const normalizeRoles = (roles?: unknown): UserRole[] => {
  if (!Array.isArray(roles)) return [];
  
  return roles.filter((r): r is UserRole =>
    ROLE_PRIORITY.includes((r as string).toLowerCase() as typeof ROLE_PRIORITY[number])
  );
};

/**
 * Checks for a specific role.
 */
export const hasRole = (
  roles: UserRole[],
  role: UserRole
): boolean => roles.includes(role);

/**
 * Checks if user has at least one of the allowed roles.
 */
export const hasAnyRole = (
  roles: UserRole[],
  allowed: UserRole[]
): boolean => {
  if (!roles || roles.length === 0) {
    return false;
  }
  
  if (!allowed || allowed.length === 0) {
    return true; // No restrictions
  }
  
  return allowed.some(role => roles.includes(role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (
  roles: UserRole[], 
  required: UserRole[]
): boolean => {
  if (!roles || roles.length === 0) {
    return false;
  }
  
  if (!required || required.length === 0) {
    return true;
  }
  
  return required.every(role => roles.includes(role));
};

/**
 * Resolves the primary role based on system priority.
 * Priority: admin > super_admin > tutor > parent > student
 */
export const getPrimaryRole = (
  roles: UserRole[]
): UserRole | 'user' =>
  ROLE_PRIORITY.find(role => roles.includes(role)) ?? 'user';

/**
 * Utility function to extract user roles from auth payload
 */
export const getUserRoles = (auth: AuthPayload | null): UserRole[] =>
  normalizeRoles(auth?.user.roles);

/* =========================================================
   Convenience Role Checkers
========================================================= */

/**
 * Check if user is admin
 */
export const isAdmin = (roles: UserRole[]): boolean => 
  hasRole(roles, 'admin');

/**
 * Check if user is super admin
 */
export const isSuperAdmin = (roles: UserRole[]): boolean => 
  hasRole(roles, 'super_admin');

/**
 * Check if user is tutor
 */
export const isTutor = (roles: UserRole[]): boolean => 
  hasRole(roles, 'tutor');

/**
 * Check if user is parent
 */
export const isParent = (roles: UserRole[]): boolean => 
  hasRole(roles, 'parent');

/**
 * Check if user is student
 */
export const isStudent = (roles: UserRole[]): boolean => 
  hasRole(roles, 'student');

/* =========================================================
   Role Display & UI Helpers
========================================================= */

/**
 * Get role display information
 */
export const getRoleInfo = (role: UserRole | 'user') =>  ROLE_INFO[role] || ROLE_INFO.user;

/**
 * Format roles for display
 */
export const formatRoles = (roles: UserRole[]): string => {
  if (!roles || roles.length === 0) {
    return 'No role';
  }
  
  return roles.map(role => getRoleInfo(role).label).join(', ');
};

/**
 * Get role color (hex)
 */
export const getRoleColor = (role: UserRole | 'user'): string =>
  ROLE_COLORS[role] || ROLE_COLORS.user;

/* =========================================================
   Role Hierarchy & Permissions
========================================================= */

const ROLE_HIERARCHY: Record<UserRole | 'user', number> = {
  super_admin: 5,
  admin: 4,
  tutor: 3,
  parent: 2,
  student: 1,
  user: 0,
  dev: 0
};

/**
 * Check if a role can perform an action on another role
 * Used for determining edit/delete permissions
 */
export const canManageRole = (
  actorRole: UserRole | 'user', 
  targetRole: UserRole | 'user'
): boolean => {
  return ROLE_HIERARCHY[actorRole] >= ROLE_HIERARCHY[targetRole];
};

/**
 * Get roles that a given role can manage
 */
export const getManagedRoles = (actorRole: UserRole | 'user'): UserRole[] => {
  const actorLevel = ROLE_HIERARCHY[actorRole];
  
  return ROLE_PRIORITY.filter(role => 
    ROLE_HIERARCHY[role] <= actorLevel
  ) as UserRole[];
};

/* =========================================================
   Role → Dashboard Mapping
========================================================= */

const DASHBOARD_BY_ROLE: Record<UserRole | 'user', string> = {
  dev: '/admin',
  admin: '/admin',
  super_admin: '/admin',
  tutor: '/tutor',
  student: '/student',
  parent: '/parent',
  user: '/me',
};

/**
 * Resolves the redirect path for a primary role.
 * This function is pure and fully testable.
 */
export const resolveRoleRedirect = (
  primaryRole: UserRole | 'user'
): string =>
  DASHBOARD_BY_ROLE[primaryRole] || '/me';

/* =========================================================
   Type Guards
========================================================= */

/**
 * Type guard to check if a value is a valid UserRole
 */
export const isValidRole = (role: unknown): role is UserRole => {
  return typeof role === 'string' && 
    ROLE_PRIORITY.includes(role as typeof ROLE_PRIORITY[number]);
};