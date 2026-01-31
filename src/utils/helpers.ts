/* =====================================================
   UTILITY FUNCTIONS
===================================================== */

// import type { ScoreType } from "@/types/course/assessment";
import type { Grade, ScoreType } from "@/types/course/score";
import type { User, UserRole } from "@/types/users";

/* =====================================================
   Error Normalization Utility
===================================================== */

export const extractErrorMessage = (error: unknown): string => {
  const err = error as any;
  return (
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.message ||
    'An unexpected error occurred'
  );
};

const handleError = (error: unknown): Error => {
  return new Error(extractErrorMessage(error));
};

export { handleError };

/* =====================================================
   Other Helper Functions
===================================================== */

export const calculateGrade = (percentage: number): Grade => {
    switch (true) {
        case percentage >= 90:
            return 'A';
        case percentage >= 85:
            return 'B+';
        case percentage >= 80:
            return 'B';
        case percentage >= 75:
            return 'C+';
        case percentage >= 70:
            return 'C';
        case percentage >= 60:
            return 'D';
        default:
            return 'F';
    }
};

export const getGradeColor = (grade: Grade): string => {
  const colors: Record<Grade, string> = {
    'A': 'success',
    'B+': 'success',
    'B': 'primary',
    'C+': 'info',
    'C': 'warning',
    'D': 'warning',
    'F': 'danger'
  };
  return colors[grade];
};

export const getAssessmentTypeColor = (type: ScoreType): string => {
  const colors: Record<ScoreType, string> = {
    'quiz': 'success',
    'assignment': 'primary',
    'exam': 'danger',
    'project': 'warning'
  };
  return colors[type];
};

export const getAssessmentTypeIcon = (type: ScoreType): string => {
  const icons: Record<ScoreType, string> = {
    'quiz': 'fa-clipboard-question',
    'assignment': 'fa-file-lines',
    'exam': 'fa-graduation-cap',
    'project': 'fa-diagram-project'
  };
  return icons[type];
};

export const getRoleColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    'admin': 'danger',
    'tutor': 'primary',
    'student': 'warning',
    'parent': 'success',
    'super_admin': 'dark',
    'user': 'secondary'
  };
  return colors[role];
};

export const getRoleBadgeClass = (role: UserRole): string => {
  return `bg-${getRoleColor(role)}`;
};



export const calculatePercentage = (obtained: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((obtained / total) * 100);
};

export const isOverdue = (dueDate?: string): boolean => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const getStatusBadgeClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'bg-success',
    'inactive': 'bg-secondary',
    'pending': 'bg-warning',
    'completed': 'bg-info',
    'graded': 'bg-success',
    'draft': 'bg-secondary',
    'published': 'bg-primary',
    'closed': 'bg-danger',
    'overdue': 'bg-danger',
  };
  return statusMap[status.toLowerCase()] || 'bg-secondary';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (fullName: string): string => {
  if (!fullName) return '';

  const parts = fullName
    .trim()
    .split(/\s+/) // handles multiple spaces
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) +
    parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};
/* 
USAGE:
getInitials("Chris James")        // CJ
getInitials("Chris")              // C
getInitials("Chris Michael James")// CJ
getInitials("  Chris   James  ")  // CJ

*/

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getFullName = (user: User | { names: string }): string => {
  return `${user?.names || ''}`.trim();
};

export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const groupBy = <T>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};
