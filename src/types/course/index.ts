// import type { CourseStatus, Course } from "./course";
// import type { Grade } from "./score";

// v2
export * from "./lesson";
export * from "./module";
export * from "./assessment";
export * from "./score";

export * from "./course";
export * from "./attendance";


// // v2
// // src/types/course/index.ts
// export type { Lesson, LessonCreate, LessonUpdate } from './lesson';
// export type { Module, ModuleCreate, ModuleUpdate } from './module';
// export type { Assessment } from './assessment';
// export type { Grade, ScoreModalProps, StudentScoreData } from './score';

// // Re-export main types
// export * from './lesson';
// export * from './module';
// export * from './assessment';
// export * from './score';

// // Main course types
// export type CourseStatus = 'active' | 'inactive' | 'archived' | 'draft';

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   code: string;
//   tutor_ids: string[];
//   tutors?: User[];
//   modules?: Module[];
//   lessons: Lesson[];
//   enrolledStudents: string[];
//   enrolledStudentsDetails?: User[];
//   modules_count?: number;
//   enrolled_count?: number;
//   is_active: boolean;
//   status?: CourseStatus;
//   thumbnail?: string;
//   duration?: number;
//   level?: 'beginner' | 'intermediate' | 'advanced';
//   prerequisites?: string[];
//   createdAt: string;
//   updatedAt: string;
//   createdBy?: string;
//   tutorName?: string;
//   tutor_count?: number;
//   lesson_count?: number;
//   updated_at?: (date: any) => React.ReactNode;
// }

// export interface CreateCourseDTO {
//   is_active?: boolean;
//   tutor_ids?: string[];
//   code?: string;
//   status?: CourseStatus;
//   title?: string;
//   description?: string;
//   total_modules?: number;
//   total_lessons?: number;
//   duration_weeks?: number;
//   difficulty_level?: string;
//   is_public?: boolean;
// }

// export interface UpdateCourseDTO extends Partial<CreateCourseDTO> {}

// export interface CourseFilters {
//   search?: string;
//   tutor_ids?: string[];
//   status?: CourseStatus;
//   level?: 'beginner' | 'intermediate' | 'advanced';
//   sortBy?: 'title' | 'createdAt' | 'enrolled_count' | 'code';
//   sortOrder?: 'asc' | 'desc';
//   page?: number;
//   page_size?: number;
//   include_relations?: boolean;
// }

// export interface CourseStats {
//   total: React.ReactNode;
//   active: React.ReactNode;
//   inactive: React.ReactNode;
//   totalStudents: number;
//   completedLessons: number;
//   totalLessons: number;
//   averageProgress: number;
//   averageGrade?: Grade;
// }

// export interface CourseModalContextType {
//   isOpen: boolean;
//   editingCourse: Course | null;
//   openCreateModal: () => void;
//   openEditModal: (course: Course) => void;
//   closeModal: () => void;
//   refreshTrigger: number;
//   triggerRefresh: () => void;
// }

// export interface CourseModalProps {
//   isOpen: boolean;
//   editingCourse: Course | null;
//   onClose: () => void;
//   onSuccess: () => void;
// }


