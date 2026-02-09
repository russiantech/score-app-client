// // /* =====================================================
// //    STATISTICS TYPES
// // ===================================================== */

// v2
// src/types/stats.ts
import type { Grade } from "./course/score";

export interface StatCardProps {
  value: number | string;
  label: string;
  icon: string;
  bgColor: string;
  loading?: boolean;
}

export interface AdminStats {
  total: number;  // Add this
  totalUsers: number;
  activeUsers: number;
  totalCourses: number;
  totalModules: number;
  totalLessons: number;
  totalTutors: number;
  totalStudents: number;
  totalParents: number;
  activeCourses: number;
  inactiveCourses: number;
  activeStudents: number;
  activeTutors: number;
  activeParents: number;
  inactiveParents: number;
  recentEnrollments: number;
  totalEnrollments: number;
  totalAssessments: number;
  averageClassSize: number;
  coursesWithoutTutors: number;
  studentsWithoutParents: number;
  active: number;  // Add this
  inactive: number;  // Add this
}

export interface TutorStats {
  totalCourses: number;
  totalStudents: number;
  totalLessons: number;
  totalAssessments: number;
  pendingGrading: number;
  gradedAssessments: number;
  averageScore: number;
  averageGrade?: Grade;
  upcomingAssessments: number;
  overdueAssessments: number;
}

export interface StudentStats {
  enrolledCourses: number;
  activeCourses: number;
  completedCourses: number;
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  overdueAssessments: number;
  overallGrade: Grade;
  overallPercentage: number;
  averageProgress: number;
  strongSubjects: string[];
  weakSubjects: string[];
}

export interface ParentStats {
  totalChildren: number;
  activeEnrollments: number;
  totalCourses: number;
  averagePerformance: number;
  childrenWithHighGrades: number;
  childrenNeedingAttention: number;
  upcomingAssessments: number;
  recentAchievements: number;
}

export interface RecentActivity {
  id: string;
  type: 'enrollment' | 'course' | 'user' | 'assessment' | 'attendance';
  message: string;
  timestamp: string;
  user?: {
    id: string;
    name: string;
  };
  metadata?: Record<string, any>;
}

export interface MiniStatCardProps {
  icon: string;
  iconColor: string;
  value: number | string;
  label: string;
  warning?: { text: string; count: number };
  info?: { text: string; count: number };
}

export interface AlertBannerProps {
  stats: AdminStats;
}

