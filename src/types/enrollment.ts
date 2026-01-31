// /* =====================================================
//    ENROLLMENT TYPES
// ===================================================== */
// export type EnrollmentStatus = 'active' | 'completed' | 'dropped' | 'suspended';

// export interface EnrollmentFilters {
//   search?: string;
//   status?: 'active' | 'completed' | 'dropped';
//   student_id?: string;
//   course_id?: string;
//   page?: number;
//   page_size?: number;
// }

// export interface EnrollmentCreate {
//   student_id: string;
//   course_id: string;
// }

// // export interface CreateEnrollmentDTO {
// //   studentId: string;
// //   courseId: string;
// // }

// export interface UpdateEnrollmentDTO {
//   status?: EnrollmentStatus;
//   progress?: number;
//   currentLessonId?: string;
// }

// export interface EnrollmentWithDetails extends Enrollment {
//   studentName: string;
//   courseName: string;
//   courseCode: string;
//   tutorName?: string;
//   completedAssessments: number;
//   totalAssessments: number;
// }

// // new

// export interface EnrollmentStats {
//   totalEnrollments: number;
//   activeEnrollments: number;
//   totalStudents: number;
//   totalCourses: number;
//   studentsEnrolled: number;
//   coursesWithStudents: number;
// }



/**
 * Student summary (included when include_relations=true)
 */
export interface StudentSummary {
  id: string;
  names: string;
  email: string;
}

/**
 * Course summary (included when include_relations=true)
 */
export interface CourseSummary {
  id: string;
  code: string;
  title: string;
}

/**
 * Enrollment model
 */
export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  session: string;
  term: string;
  status: 'active' | 'completed' | 'dropped' | 'pending';
  progress?: number;
  enrolled_at: string;
  completed_date?: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations (populated when include_relations=true)
  student?: StudentSummary;
  course?: CourseSummary;
}

// v2
export interface EnrollmentFilters {
  search?: string;
  status?: 'active' | 'completed' | 'dropped' | 'pending';
  student_id?: string;
  course_id?: string;
  page?: number;
  page_size?: number;
  session?: string;
  term?: string;
  sort_by?: 'enrolled_at' | 'created_at' | 'status';
  order?: 'asc' | 'desc';
  include_relations?: boolean; // key parameter.

}

export interface EnrollmentCreate {
  student_id: string;
  course_id: string;
  session?: string;
  term?: string;
}
/*
export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
  
  // Nested relationships
  student?: {
    id: string;
    names: string;
    email: string;
    is_active: boolean;
  };
  
  course?: {
    id: string;
    title: string;
    code: string;
    description?: string;
  };
}
*/


export interface EnrollmentStats {
  total_enrollments: number;
  active_enrollments: number;
  students_enrolled: number;
  courses_with_students: number;
  total_students: number;
  total_courses: number;
}

