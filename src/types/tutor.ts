// /* =====================================================
//    TUTOR ASSIGNMENT TYPES
// ===================================================== */

// // import type { ReactNode } from "react";

// import type { User } from "./auth";
// import type { Course } from "./course";

// export interface TutorAssignment {
//   id: string;
//   tutorId: string;
//   tutor?: User;
//   tutorName?: string;
//   courseId: string;
//   course?: Course;
//   courseName?: string;
//   assignedAt: string;
//   assignedBy: string;
//   assignedByName?: string;
//   isActive: boolean;
// }

// export interface CreateTutorAssignmentDTO {
//   tutorId: string;
//   courseId: string;
// }


// export interface Assignment {
//   id: string;
//   courseId: string;
//   tutorId: string;
//   assignedDate: string;
// }

// export interface AssignmentStats {
//   totalCourses: number;
//   assignedCourses: number;
//   unassignedCourses: number;
//   totalTutors: number;
// }



// // v2
// /**
//  * Tutor summary (included when include_relations=true)
//  */
// export interface TutorSummary {
//   id: string;
//   names: string;
//   email: string;
// }

// /**
//  * Course summary (included when include_relations=true)
//  */
// export interface CourseSummary {
//   id: string;
//   code: string;
//   title: string;
// }

// // 
// /**
//  * Tutor–Course Assignment model
//  */
// export interface TutorAssignment {
//   id: string;
//   tutor_id: string;
//   course_id: string;

//   status: 'active' | 'inactive' | 'revoked';

//   assigned_at: string;
//   assigned_by: string;

//   created_at: string;
//   updated_at: string;

//   // Relations (populated when include_relations=true)
//   tutor?: TutorSummary;
//   course?: CourseSummary;
// }

// // 
// export interface TutorAssignmentFilters {
//   search?: string;

//   tutor_id?: string;
//   course_id?: string;

//   status?: 'active' | 'inactive' | 'revoked';

//   page?: number;
//   page_size?: number;

//   sort_by?: 'assigned_at' | 'created_at' | 'status';
//   order?: 'asc' | 'desc';

//   include_relations?: boolean; // key parameter
// }

// // DTO
// export interface TutorAssignmentCreate {
//   tutor_id: string;
//   course_id: string;
// }

// // 
// export interface TutorAssignmentStats {
//   totalCourses: ReactNode;
//   assignedCourses: ReactNode;
//   unassignedCourses: ReactNode;
//   totalTutors: ReactNode;
//   total_assignments: number;
//   active_assignments: number;
//   inactive_assignments: number;

//   tutors_assigned: number;
//   total_tutors: number;

//   courses_assigned: number;
//   total_courses: number;
// }



// // v3
// /* =====================================================
//    TUTOR ASSIGNMENT TYPES
//    Type definitions for tutor-to-course assignments
// ===================================================== */

// import type { User } from './auth';
// import type { Course } from './course';

// /**
//  * Tutor Assignment - represents a tutor assigned to a course
//  */
// export interface TutorAssignment {
//   id: string;
//   tutor_id: string;
//   course_id: string;
//   status: 'active' | 'inactive' | 'revoked';
//   assigned_at: string;
//   revoked_at?: string | null;
//   created_at: string;
//   updated_at: string;
  
//   // Optional expanded relations (when include_relations=true)
//   tutor?: User;
//   course?: Course;
  
//   // Metadata
//   notes?: string;
//   assigned_by?: string; // Admin who made the assignment
// }

// /**
//  * DTO for creating a new tutor assignment
//  */
// export interface TutorAssignmentCreate {
//   tutor_id: string;
//   course_id: string;
//   notes?: string;
// }

// /**
//  * Filters for querying tutor assignments
//  */
// export interface TutorAssignmentFilters {
//   // Pagination
//   page?: number;
//   page_size?: number;
  
//   // Filtering
//   tutor_id?: string;
//   course_id?: string;
//   status?: 'active' | 'inactive' | 'revoked' | 'all';
  
//   // Search
//   search?: string; // Search by tutor name, email, or course code
  
//   // Sorting
//   sort_by?: 'created_at' | 'assigned_at' | 'tutor_name' | 'course_code';
//   sort_order?: 'asc' | 'desc';
  
//   // Include expanded relations
//   include_relations?: boolean;
  
//   // Date filters
//   assigned_after?: string;
//   assigned_before?: string;
// }

// /**
//  * Statistics for tutor assignments
//  */
// export interface TutorAssignmentStats {
//   total_assignments: number;
//   active_assignments: number;
//   inactive_assignments: number;
//   revoked_assignments: number;
  
//   total_tutors: number;
//   tutors_assigned: number; // Tutors with at least one assignment
//   tutors_unassigned: number;
  
//   total_courses: number;
//   courses_assigned: number; // Courses with at least one tutor
//   courses_unassigned: number;
  
//   avg_courses_per_tutor: number;
//   avg_students_per_tutor: number;
  
//   // Top tutors by course count
//   top_tutors?: Array<{
//     tutor_id: string;
//     tutor_name: string;
//     course_count: number;
//     student_count: number;
//   }>;
  
//   // Recent assignments
//   recent_assignments?: TutorAssignment[];
// }

// /**
//  * Tutor workload summary
//  */
// export interface TutorWorkload {
//   tutor_id: string;
//   tutor: User;
//   total_courses: number;
//   active_courses: number;
//   total_students: number;
//   courses: Array<{
//     course_id: string;
//     course_code: string;
//     course_title: string;
//     student_count: number;
//     status: string;
//   }>;
// }

// /**
//  * Course assignment summary
//  */
// export interface CourseAssignment {
//   course_id: string;
//   course: Course;
//   assigned_tutors: number;
//   active_tutors: number;
//   tutors: Array<{
//     tutor_id: string;
//     tutor_name: string;
//     tutor_email: string;
//     status: string;
//     assigned_at: string;
//   }>;
// }

// /**
//  * Assignment history entry
//  */
// export interface AssignmentHistory {
//   id: string;
//   assignment_id: string;
//   action: 'created' | 'updated' | 'activated' | 'deactivated' | 'revoked' | 'reassigned';
//   performed_by: string;
//   performed_at: string;
//   details: Record<string, any>;
//   old_values?: Record<string, any>;
//   new_values?: Record<string, any>;
// }

// /**
//  * Bulk assignment response
//  */
// export interface BulkAssignmentResponse {
//   created: TutorAssignment[];
//   failed: Array<{
//     course_id: string;
//     error: string;
//   }>;
//   summary: {
//     total: number;
//     successful: number;
//     failed: number;
//   };
// }

// /**
//  * Reassignment request
//  */
// export interface ReassignmentRequest {
//   assignment_id: string;
//   new_tutor_id: string;
//   reason?: string;
//   notify_students?: boolean;
//   effective_date?: string;
// }



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