
import type { CoursePerformance } from "../performance";
import type { User } from "../users";
import type { Lesson } from "./lesson";
import type { Module } from "./module";
import type { Grade } from "./score";

export type CourseStatus = 'active' | 'inactive' | 'archived' | 'draft';

// v2
export interface CourseBase {
  id: string;
  code: string;
  title: string;
  description: string;
  is_active: boolean;
}

export interface Course extends CourseBase {
  tutor_count: number;
  lesson_count: number;

  tutor_ids: string[];
  tutors?: User[];

  modules?: Module[];
  lessons: Lesson[];

  // enrolledStudents: string[];
  enrolled?: string[] | number;
  students?: User[];
  
  modules_count?: number;
  enrolled_count?: number;

  status?: CourseStatus;

  thumbnail?: string;
  duration?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];

  created_at: string;
  updated_at: string;
  createdBy?: string;
}

/**
 * Lightweight course summary (for lists / dashboards)
 */

export interface CourseSummary extends CourseBase {
  students_count: number;
  lessons_count: number;
  modules_count: number;
  students?: User[];  // optional for summary, but can be included when include_relations=true
}

export interface CreateCourseDTO {

  is_active?: boolean
  tutor_ids?: string[]
  code?: string
  status?: CourseStatus
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

// export interface CourseStats {
//   total: ReactNode;
//   active: ReactNode;
//   inactive: ReactNode;
//   totalStudents: number;
//   completedLessons: number;
//   totalLessons: number;
//   averageProgress: number;
//   averageGrade?: Grade;
// }

export interface CourseStats {
  total: number;        //  Change from ReactNode to number
  active: number;       //  Change from ReactNode to number
  inactive: number;     //  Change from ReactNode to number
  totalStudents: number;
  completedLessons: number;
  totalLessons: number;
  averageProgress: number;
  averageGrade?: Grade;
}

export interface CourseListProps {
  courses: Course[];
  onView: (course: Course) => void;
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


// course details page types
export interface CoursesTabProps {
  courses: CoursePerformance[];
}
