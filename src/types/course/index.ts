/* =====================================================
   COURSE TYPES
===================================================== */

import type { ReactNode } from "react";
// import type { User } from "../auth";
import type { Grade } from "./score";
import type { Lesson } from "./lesson";

export type CourseStatus = 'active' | 'inactive' | 'archived' | 'draft';

/* 01
export interface Course {
  tutor_name: any;
  tutor_id: string;
  modules_count: number;
  enrolled_count: number;
  created_at(created_at: any): import("react").ReactNode;
  department: any;
  credits: number;
  semester: string;
  tutorEmail: ReactNode;
  id: string;
  title: string;
  description: string;
  code: string;
  tutorId: string;
  tutorName?: string;
  tutor?: User;
  lessons: Lesson[];
  enrolledStudents: string[];
  enrolledStudentsDetails?: User[];
  status: CourseStatus;
  thumbnail?: string;
  duration?: number; // in hours
  level?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}
*/
/* 02
export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;

  // Tutors
  tutor_ids: string[];        // ✅ canonical
  tutors?: User[];            // populated via backend when needed

  // Relations
  lessons: Lesson[];
  enrolledStudents: string[];
  enrolledStudentsDetails?: User[];

  // Stats
  modules_count?: number;
  enrolled_count?: number;

  // Meta
  status: CourseStatus;
  thumbnail?: string;
  duration?: number; // hours
  level?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];

  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

*/
// export interface CreateCourseDTO {
//   tutor_ids: string | number | readonly string[] | undefined;
//   title: string;
//   description: string;
//   code: string;
//   status?: CourseStatus;
//   thumbnail?: string;
//   duration?: number;
//   level?: 'beginner' | 'intermediate' | 'advanced';
//   prerequisites?: string[];
// }
export interface Course {
  
  updated_at(updated_at: any): ReactNode;
  id: string;
  title: string;
  description: string;
  code: string;

  // Tutors
  tutor_ids: string[];       // canonical IDs
  tutors?: User[];           // populated via backend when needed

  // Relations
  modules?: Module[];
  lessons: Lesson[];
  enrolledStudents: string[];
  enrolledStudentsDetails?: User[];

  // Stats
  modules_count?: number;
  enrolled_count?: number;

  // Meta
  is_active: boolean;        // actual backend boolean
  status?: CourseStatus;     // derived/display only
  thumbnail?: string;
  duration?: number; // hours
  level?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];

  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface CreateCourseDTO {
  // tutor_ids: string[];        //  explicit & safe
  // title: string;
  // description: string;
  // code: string;
  // status?: CourseStatus;
  // thumbnail?: string;
  // duration?: number;
  // level?: 'beginner' | 'intermediate' | 'advanced';
  // prerequisites?: string[];

  // 
  is_active?: boolean
  tutor_ids?: string[]
  code?: string
  title?: string
  description?: string
  total_modules?: number
  total_lessons?: number
  duration_weeks?: number
  difficulty_level?: string
  is_public?: boolean



}


export interface UpdateCourseDTO extends Partial<CreateCourseDTO> {}


export interface CourseFilters {
  search?: string;
  tutor_ids?: string[];        // multi-filter
  status?: CourseStatus;
  level?: 'beginner' | 'intermediate' | 'advanced';
  sortBy?: 'title' | 'createdAt' | 'enrolled_count' | 'code';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
  include_relations?: boolean; // key parameter.
}

export interface CourseStats {
  total: ReactNode;
  active: ReactNode;
  inactive: ReactNode;
  totalStudents: number;
  completedLessons: number;
  totalLessons: number;
  averageProgress: number;
  averageGrade?: Grade;
}

// generic course crud modal
export interface CourseModalContextType {
  isOpen: boolean;
  editingCourse: Course | null;
  openCreateModal: () => void;
  openEditModal: (course: Course) => void;
  closeModal: () => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export interface CourseModalProps {
  isOpen: boolean;
  editingCourse: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}


// export interface Module {
//   id: string;
//   course_id: string;
//   title: string;
//   description?: string;
//   order?: string;
//   lessons: Lesson[];
// }

// new - assessments
// export interface Lesson {
//   id: string;
//   title: string;
//   description?: string;
//   date: string;
//   duration: string;
//   status: 'completed' | 'ongoing' | 'upcoming' | 'cancelled';
//   assessments_count?: number;
// }

/* 
  LESSON
*/

// export interface Lesson {
//   id: string;
//   module_id?: string;   // ✅ NEW REQUIRED
//   title: string;
//   date: string;
//   duration: string;
//   description?: string;
//   status: "upcoming" | "ongoing" | "completed" | "cancelled";
//   assessments_count?: number;
// }

// src/types/lesson.ts
// export interface Lesson {
//   id: string;
//   module_id: string;
//   title: string;
//   description?: string;
//   duration?: string;
//   date?: string;
//   order?: number;
//   status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
//   assessments_count?: number;
//   created_at: string;
//   updated_at: string;
// }



export interface LessonCreate {
  module_id: string;
  title: string;
  description?: string;
  duration?: string;
  date?: string;
  order?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface LessonUpdate {
  title?: string;
  description?: string;
  duration?: string;
  date?: string;
  order?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Assessment {
  id: string;
  type: 'assess' | 'assign' | 'project' | 'exam';
  label: string;
  maxScore: number;
  weight: number;
  description: string;
  color: string;
  optional?: boolean;
}

export interface StudentScore {
  [assessmentId: string]: string | number;
}

export interface ScoresData {
  [studentId: string]: StudentScore;
}



// 
