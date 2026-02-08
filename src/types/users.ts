import type { ReactNode } from "react";
import type { SignupData } from './auth';

export type UserRole =
  | 'dev'
  | 'admin'
  | 'super_admin'
  | 'tutor'
  | 'student'
  | 'parent'
  | 'user';

export const ALL_USER_ROLES: readonly UserRole[] = [
  'dev',
  'super_admin',
  'student',
  'parent',
  'tutor',
  'admin',
];

export interface User {
  isActive: unknown;
  department: ReactNode;
  qualifications: any;
  // user(user: any): unknown;
  id: string;
  username?: string;
  email: string;
  names?: string;
  phone?: string;
  address?: string;

  /**
   * UserRole assigned to the user.
   * Always an array (never single role).
   */
  roles: UserRole[];

  is_active: boolean;
  is_verified: boolean;

  avatar?: string;

  created_at: string;   // keep as ISO string (backend truth)
  updated_at: string;
}

export type Child = User & {
  enrolledCourses: number;
  averagePerformance: number;
};

/**
 * Admin/internal user creation
 * Extends signup but enforces roles
 */
export interface CreateUserDTO extends Partial<SignupData> {
  username: string;
  names: string;
  email: string;
  password: string;

  roles: UserRole[];

  /** Only applicable when role includes "student" */
  parent_id?: string | null;
  
}

/**
 * Admin/internal user update
 */
export interface UpdateUserDTO extends Partial<SignupData> {
  roles?: UserRole[];

  /** Only applicable for students */
  parent_id?: string | null;

  /** Admin/system fields */
  is_active?: boolean;
  is_verified?: boolean;

  /** Required only for self-updates (not admin) */
  current_password?: string;
}


// Filters & Stats(Normalized)
export interface UserFilters {
  page?: number;
  page_size?: number;
  search?: string;
  role?: UserRole | 'all';
  is_active?: boolean;
  is_verified?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'names' | 'email';
  order?: 'asc' | 'desc';
}

// export interface UserStats {
//   total_users: number;
//   active_users: number;
//   inactive_users: number;
//   verified_users: number;
//   users_by_role: Record<UserRole, number>;
// }


export interface UserStats {
  total: number;
  students: number;
  tutors: number;
  parents: number;
  admins: number;
  active: number;
  inactive: number;
}

// Modal context & props (aligned + clean)
export interface UserModalContextType {
  isOpen: boolean;
  editingUser: User | null;
  defaultRole: UserRole | null;

  openCreateModal: (defaultRole?: UserRole) => void;
  openEditModal: (user: User) => void;
  closeModal: () => void;

  refreshTrigger: number;
  triggerRefresh: () => void;
}

export interface UserModalProps {
  isOpen: boolean;
  editingUser: User | null;
  defaultRole?: UserRole;

  onClose: () => void;
  onSuccess: () => void;

  /** Used to determine admin privileges */
  currentUser?: User;
}


// Role metadata (UI + permissions)
export interface RoleInfo {
  icon: string;
  color: 'primary' | 'success' | 'info' | 'danger';
  description: string[];
  permissions: string[];
}

export interface UserAvatarProps {
  names: string;
  size?: number;
  bgColor?: string;
  className?: string;
}


export const ROLE_HIERARCHY: Record<UserRole, number> = {
  dev: 0,
  super_admin: 0,
  student: 1,
  parent: 2,
  tutor: 3,
  admin: 4,
  user: 0
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  dev: [
    'full_system_access',
    'manage_users',
  ],
  super_admin: [
    'full_system_access',
    'manage_users',
    'manage_system_settings',
  ],
  student: [
    'view_own_profile',
    'view_own_courses',
    'view_own_grades',
    'submit_assignments',
  ],
  parent: [
    'view_children_profiles',
    'view_children_courses',
    'view_children_grades',
  ],
  tutor: [
    'manage_assigned_courses',
    'grade_assignments',
    'record_attendance',
  ],
  admin: [
    'full_system_access',
    'manage_users',
    'manage_courses',
    'update_user_roles',
  ],
  user: []
};



