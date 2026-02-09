// =====================================================
//     LESSON TYPES
// ===================================================== 

// src/types/course/lesson.ts
// Complete type definitions matching backend schema
// v2
import type { AttendanceResponse } from "./attendance";
import type { Course } from "./course";
import type { Module } from "./module";
import type { LessonScoreResponse } from "./score";

export interface CreateLessonDTO {
  module_id: string;           // module this lesson belongs to
  title: string;
  description?: string;
  content?: string;
  order: number;
  date?: string;
  duration?: number;           // in minutes
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_published?: boolean;
}

export interface UpdateLessonDTO extends Partial<CreateLessonDTO> {}

// Full Lesson type including attendance and scores
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  order: number;
  date?: string;
  duration?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  total_assessments?: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;

  // Attendance
  attendances?: AttendanceResponse[];
  attendance_count?: number;
  present_count?: number;
  absent_count?: number;
  attendance_rate?: number;

  // Scores
  scores?: LessonScoreResponse[];
  scores_count?: number;
  average_score?: number;
  highest_score?: number;
  lowest_score?: number;
}


export interface AddLessonModalProps {
  course: Course;
 students_count?: number;
 lessons_count?: number;
  lesson?: Lesson | null;
  isEditing?: boolean;
  onSave: (data: {
    title: string;
    date: string;
    duration: string;
    description: string;
  }) => void;
  onClose: () => void;
}

// modal's form state
export interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLessonDTO | UpdateLessonDTO) => Promise<void>;
  module: Module;
  lesson?: Lesson | null;
  isEditing?: boolean;
}

export type LessonFormState = {
  title: string;
  order: number;
  description: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
};
