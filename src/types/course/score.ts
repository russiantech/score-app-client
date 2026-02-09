// /* =====================================================
//    SCORE TYPES
// ===================================================== */

// src/types/course/score.ts
// Complete type definitions matching backend schema

import type { ReactNode } from "react";
import type { Lesson } from "./lesson";
import type { Course } from ".";
import type { User } from "../users";

export type Grade = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';

export type ScoreStatus = 'graded' | 'pending' | 'submitted' | 'not-submitted';

export type ScoreType = 
  | 'homework' 
  | 'classwork' 
  | 'quiz' 
  | 'test' 
  | 'exam' 
  | 'project' 
  | 'participation' 
  | 'other';

export interface ScoreColumn {
  // added for frontend convenience
  marksObtained: ReactNode;
  totalMarks: ReactNode;
  percentage: ReactNode;
  grade(grade: any): unknown;

  id: string;
  type: ScoreType;
  title: string;
  description?: string | null;
  max_score: number;
  weight: number; // Decimal (0.3 = 30%)
  order: number;
  is_active?: boolean;
  lesson_id?: string;
  module_id?: string;
  course_id?: string;
  remarks?: string | null;
}

export interface StudentScoreDetail {
  score: number;
  max_score: number;
  percentage: number;
  remarks: string;
  score_id: string | null;
  is_recorded: boolean;
}

export interface StudentScoreData {
  enrollment_id: string;
  student_id: string;
  names: string;
  email: string;
  username?: string;
  scores: {
    [columnId: string]: StudentScoreDetail;

  };
  total_percentage: number;
  grade: string | null;
  remarks?: string;
}

export interface LessonScoreResponse {

  // scores: Score[] | PromiseLike<Score[]>;

  lesson: {
    id: string;
    title: string;
    module_id: string;
    course_id: string;
  };

  summary: {
    total_students: number;
    recorded_count: number;
    total_columns: number;
  };

  columns: ScoreColumn[];
  students: StudentScoreData[];

  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };

}

export interface ColumnScoreInput {
  column_id: string;
  score: number;
  remarks?: string;
}

export interface StudentScoreInput {
  enrollment_id?: string; // Will be mapped from student_id if missing
  student_id?: string;
  column_scores: ColumnScoreInput[];
}

export interface ColumnConfig {
  id?: string; // UUID for existing, temp ID for new
  type: ScoreType;
  title: string;
  description?: string | null;
  max_score: number;
  weight: number;
  order?: number;
}

export interface BulkScoreCreateDTO {
  lesson_id: string;
  columns: ColumnConfig[];
  scores: StudentScoreInput[];
}

export interface ScoreColumnCreate {
  lesson_id?: string;
  module_id?: string;
  course_id?: string;
  type: ScoreType;
  title: string;
  description?: string;
  max_score: number;
  weight: number;
  order?: number;
}

export interface ScoreColumnUpdate {
  id: string;
  type?: ScoreType;
  title?: string;
  description?: string;
  max_score?: number;
  weight?: number;
  order?: number;
}


// modals
// type Student = {
//   id: string | number;
//   username?: string;
//   names?: string;
//   // add other fields as needed
// };

// type Lesson = {
//   title: string;
//   // add other fields as needed
// };

// type Course = {
//   code?: string;
//   // add other fields as needed
// };

export type ScoreModalProps = {
  lesson: Lesson;
  course: Course;
  students: User[];
  onClose: () => void;
  onSave: (scores: any) => Promise<void>;
};


export interface StudentScores {
  [assessmentId: string]: string;
}

export interface AllScores {
  [studentId: string]: StudentScores;
}

// Helper constants and functions
export const SCORE_TYPE_LABELS: Record<ScoreType, string> = {
  homework: 'Homework',
  classwork: 'Classwork',
  quiz: 'Quiz',
  test: 'Test',
  exam: 'Exam',
  project: 'Project',
  participation: 'Participation',
  other: 'Other'
};

export const SCORE_TYPE_COLORS: Record<ScoreType, string> = {
  homework: 'success',
  classwork: 'info',
  quiz: 'primary',
  test: 'warning',
  exam: 'dark',
  project: 'success',
  participation: 'secondary',
  other: 'light'
};



// project modal types

export interface CourseProjectScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSave: () => void;
}

export interface CourseProjectScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onSave: () => void;
}

export interface ProjectRubricItem { 
  id: string;
  title: string;
  max_score: number;
  weight: number;
}

export interface StudentProjectData {
  enrollment_id: string;
  student_id: string;
  names: string;
  email: string;
  username?: string;
  rubric_scores: Record<string, number>;
  total_score: number;
  max_score: number;
  percentage: number;
  grade: string | null;
  remarks: string;
  score_id: string | null;
  is_recorded: boolean;
}

// flexible score modal types
export interface FlexibleScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  students: Array<{ id: string; names: string; email: string; username?: string }>;
  onSave: () => void;
}

export interface StudentScoreData {
  enrollment_id: string;
  student_id: string;
  names: string;
  email: string;
  username?: string;
  scores: Record<string, {
    score: number;
    max_score: number;
    percentage: number;
    remarks: string;
    score_id: string | null;
    is_recorded: boolean;
  }>;
  total_percentage: number;
  grade: string | null;
}
