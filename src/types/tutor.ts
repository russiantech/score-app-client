// /* =====================================================
//    TUTOR ASSIGNMENT TYPES
// ===================================================== */

// v4
// ============================================================================
// TYPE DEFINITIONS (types/tutor.ts)
// ============================================================================
import type { Course, CourseSummary } from "./course/course";
import type { User } from "./users";

/**
 * Tutor summary (included when include_relations=true)
 */
export interface TutorSummary {
  id: string;
  names: string;
  email: string;
  is_active: boolean;
}

/**
 * Tutor–Course Assignment model
 */

export interface TutorAssignment {
  id: string;
  tutor_id: string;
  course_id: string;
  status: 'active' | 'inactive' | 'revoked';
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
  
  // Relations (populated when include_relations=true)
  tutor?: TutorSummary;
  course?: CourseSummary;

}

/**
 * Assignment creation data
 */
export interface TutorAssignmentCreate {
  tutor_id: string;
  course_id: string;
  notes?: string;
}

/**
 * Parameters for listing assignments
 */
export interface TutorAssignmentFilters {
  page?: number;
  page_size?: number;
  search?: string;
  status?: 'active' | 'inactive' | 'revoked';
  tutor_id?: string;
  course_id?: string;
  sort_by?: 'created_at' | 'updated_at' | 'status';
  order?: 'asc' | 'desc';
  include_relations?: boolean;
}

/**
 * Assignment statistics (matches your backend response)
 */
export interface TutorAssignmentStats {
  total_assignments: number;
  active_assignments: number;
  inactive_assignments: number;
  revoked_assignments: number;
  total_tutors: number;
  tutors_assigned: number;
  tutors_unassigned: number;
  total_courses: number;
  courses_assigned: number;
  courses_unassigned: number;
  avg_courses_per_tutor: number;
}

export interface TutorPerformanceStats {
  total_courses: number;
  total_students: number;
  total_lessons: number;
  total_assessments: number;
  pending_grading: number;
  graded_assessments: number;
  average_score: number;
  average_grade: number;
  upcoming_assessments: number;
  overdue_assessments: number;
}

// ============================================================================
// ASSIGNMENT MODAL COMPONENT
// ============================================================================

export interface AssignmentModalProps {
  show: boolean;
  onClose: () => void;
  tutors: User[];
  courses: Course[];
  assignments: TutorAssignment[];
  onAssign: (tutorId: string, courseId: string) => Promise<void>;
  assigning: boolean;
  preselectedTutorId?: string;
  preselectedCourseId?: string;
}