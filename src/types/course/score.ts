// /* =====================================================
//    SCORE TYPES
// ===================================================== */

// import type { AssessmentType } from "./assessment";
// import type { User } from "./auth";

// export type Grade = 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
// export type ScoreStatus = 'graded' | 'pending' | 'submitted' | 'not-submitted';

// export interface Score {
//   id: string;
//   assessmentId: string;
//   assessmentTitle?: string;
//   assessmentType?: AssessmentType;
//   studentId: string;
//   studentName?: string;
//   student?: User;
//   marksObtained: number;
//   totalMarks: number;
//   percentage: number;
//   grade: Grade;
//   status: ScoreStatus;
//   comments?: string;
//   feedback?: string;
//   recordedBy: string;
//   recordedByName?: string;
//   recordedAt: string;
//   submissionId?: string;
//   isLate?: boolean;
//   attemptNumber?: number;
// }

// export interface CreateScoreDTO {
//   assessmentId: string;
//   studentId: string;
//   marksObtained: number;
//   comments?: string;
//   feedback?: string;
// }

// export interface UpdateScoreDTO {
//   marksObtained?: number;
//   comments?: string;
//   feedback?: string;
// }

// export interface BulkScoreEntry {
//   studentId: string;
//   marksObtained: number;
//   comments?: string;
//   feedback?: string;
// }

// export interface BulkScoreCreateDTO {
//   assessmentId: string;
//   scores: BulkScoreEntry[];
// }

// export interface ScoreFilter {
//   courseId?: string;
//   lessonId?: string;
//   assessmentId?: string;
//   studentId?: string;
//   status?: ScoreStatus;
//   minPercentage?: number;
//   maxPercentage?: number;
//   grade?: Grade;
// }




// // v2

// // src/types/score.ts

// export interface Score {
//   id: string;
//   lesson_id: string;
//   student_id: string;
//   score: number;
//   max_score: number;
//   percentage?: number;
//   grade?: string;
//   remarks?: string;
//   created_at?: string;
//   updated_at?: string;
// }

// export interface ScoreCreate {
//   lesson_id: string;
//   student_id: string;
//   score: number;
//   max_score: number;
//   remarks?: string;
// }

// export interface ScoreUpdate {
//   score?: number;
//   max_score?: number;
//   remarks?: string;
// }

// export interface ScoreBulkCreate {
//   lesson_id: string;
//   scores: {
//     student_id: string;
//     score: number;
//     max_score: number;
//     remarks?: string;
//   }[];
// }




// // v3
// // src/types/score.ts

// export type ScoreType = 'assessment' | 'assignment' | 'exam' | 'project';

// export interface StudentScoreData {
//   enrollment_id: string;
//   student_id: string;
//   names: string;
//   email: string;
//   username: string;
//   score: number;
//   max_score: number;
//   percentage: number;
//   grade: string | null;
//   remarks: string;
//   score_id: string | null;
//   is_recorded: boolean;
// }

// export interface ScoreResponse {
//   lesson?: {
//     id: string;
//     title: string;
//     module_id: string;
//     course_id: string;
//   };
//   module?: {
//     id: string;
//     title: string;
//     course_id: string;
//   };
//   course?: {
//     id: string;
//     title: string;
//     code: string;
//   };
//   summary: {
//     total_students: number;
//     recorded_count: number;
//     max_score: number;
//   };
//   students: StudentScoreData[];
// }

// export interface ScoreBulkCreate {
//   // For assessments and assignments (lesson level)
//   lesson_id?: string;
//   // For exams (module level)
//   module_id?: string;
//   // For projects (course level)
//   course_id?: string;
//   // Type of score
//   score_type: ScoreType;
//   // Max possible score
//   max_score: number;
//   // Individual student scores
//   scores: {
//     enrollment_id: string;
//     score: number;
//     remarks?: string;
//   }[];
// }

// export interface ScoreCreate {
//   lesson_id?: string;
//   module_id?: string;
//   course_id?: string;
//   enrollment_id: string;
//   score_type: ScoreType;
//   score: number;
//   max_score: number;
//   remarks?: string;
// }

// export interface ScoreUpdate {
//   score?: number;
//   max_score?: number;
//   remarks?: string;
// }


// // v3
// // src/types/score.ts - Updated with flexible scoring

// export type ScoreType = 'assessment' | 'assignment' | 'exam' | 'project';

// export interface ScoreColumn {
//   id: string;
//   type: ScoreType;
//   title: string;
//   max_score: number;
//   weight: number; // Percentage weight (0-1)
//   order: number;
// }

// export interface StudentScoreData {
//   student_id: string;
//   names: string;
//   email: string;
//   username: string;
//   scores: {
//     [columnId: string]: {
//       score: number;
//       remarks: string;
//       score_id: string | null;
//       is_recorded: boolean;
//     };
//   };
//   total_score: number;
//   total_percentage: number;
//   grade: string | null;
// }

// export interface ScoreResponse {
//   lesson?: {
//     id: string;
//     title: string;
//     module_id: string;
//     course_id: string;
//   };
//   module?: {
//     id: string;
//     title: string;
//     course_id: string;
//   };
//   course?: {
//     id: string;
//     title: string;
//     code: string;
//   };
//   summary: {
//     total_students: number;
//     recorded_count: number;
//   };
//   columns: ScoreColumn[]; // Multiple score columns
//   students: StudentScoreData[];
//   pagination?: {
//     page: number;
//     page_size: number;
//     total_pages: number;
//     total_items: number;
//   };
// }

// export interface ScoreBulkCreate {
//   // For lesson level (assessments/assignments)
//   lesson_id?: string;
//   // For module level (exams)
//   module_id?: string;
//   // For course level (projects)
//   course_id?: string;
//   // Score columns configuration
//   columns: {
//     id?: string; // For updating existing columns
//     type: ScoreType;
//     title: string;
//     max_score: number;
//     weight: number;
//   }[];
//   // Individual student scores
//   scores: {
//     student_id: string;
//     column_scores: {
//       column_id: string;
//       score: number;
//       remarks?: string;
//     }[];
//   }[];
// }




// // v4
// // v4 - Flexible scoring types
// // src/types/course/score.ts

// export type ScoreType = 
//   | 'homework' 
//   | 'classwork' 
//   | 'quiz' 
//   | 'test' 
//   | 'exam' 
//   | 'project' 
//   | 'participation' 
//   | 'other';

// export interface ScoreColumn {
//   id: string;
//   type: ScoreType;
//   title: string;
//   description?: string;
//   max_score: number;
//   weight: number; // Decimal (0.3 = 30%)
//   order: number;
//   is_active?: boolean;
//   lesson_id?: string;
//   module_id?: string;
//   course_id?: string;
// }

// export interface StudentScoreDetail {
//   score: number;
//   max_score: number;
//   percentage: number;
//   remarks: string;
//   score_id: string | null;
//   is_recorded: boolean;
// }

// export interface StudentScoreData {
//   enrollment_id: string;
//   student_id: string;
//   names: string;
//   email: string;
//   username?: string;
//   scores: {
//     [columnId: string]: StudentScoreDetail;
//   };
//   total_percentage: number;
//   grade: string | null;
// }

// export interface LessonScoreResponse {
//   lesson: {
//     id: string;
//     title: string;
//     module_id: string;
//     course_id: string;
//   };
//   summary: {
//     total_students: number;
//     recorded_count: number;
//     total_columns: number;
//   };
//   columns: ScoreColumn[];
//   students: StudentScoreData[];
// }

// export interface ColumnScoreInput {
//   column_id: string;
//   score: number;
//   remarks?: string;
// }

// export interface StudentScoreInput {
//   student_id: string;
//   column_scores: ColumnScoreInput[];
// }

// export interface BulkScoreRequest {
//   lesson_id: string;
//   columns: Array<{
//     id?: string; // UUID for existing, temp ID for new
//     type: ScoreType;
//     title: string;
//     description?: string;
//     max_score: number;
//     weight: number;
//     order?: number;
//   }>;
//   scores: StudentScoreInput[];
// }

// export interface ScoreColumnCreate {
//   lesson_id?: string;
//   module_id?: string;
//   course_id?: string;
//   type: ScoreType;
//   title: string;
//   description?: string;
//   max_score: number;
//   weight: number;
//   order?: number;
// }

// export interface ScoreColumnUpdate {
//   id: string;
//   type?: ScoreType;
//   title?: string;
//   description?: string;
//   max_score?: number;
//   weight?: number;
//   order?: number;
// }

// // Helper functions
// export const SCORE_TYPE_LABELS: Record<ScoreType, string> = {
//   homework: 'Homework',
//   classwork: 'Classwork',
//   quiz: 'Quiz',
//   test: 'Test',
//   exam: 'Exam',
//   project: 'Project',
//   participation: 'Participation',
//   other: 'Other'
// };

// export const SCORE_TYPE_COLORS: Record<ScoreType, string> = {
//   homework: 'primary',
//   classwork: 'info',
//   quiz: 'warning',
//   test: 'danger',
//   exam: 'dark',
//   project: 'success',
//   participation: 'secondary',
//   other: 'light'
// };

// export const DEFAULT_LESSON_COLUMNS: Omit<ScoreColumn, 'id' | 'lesson_id'>[] = [
//   {
//     type: 'homework',
//     title: 'Homework',
//     max_score: 30,
//     weight: 0.3,
//     order: 1
//   },
//   {
//     type: 'classwork',
//     title: 'Classwork',
//     max_score: 20,
//     weight: 0.2,
//     order: 2
//   },
//   {
//     type: 'quiz',
//     title: 'Quiz',
//     max_score: 50,
//     weight: 0.5,
//     order: 3
//   }
// ];

// export function calculateGrade(percentage: number): string {
//   if (percentage >= 90) return 'A+';
//   if (percentage >= 80) return 'A';
//   if (percentage >= 75) return 'B+';
//   if (percentage >= 70) return 'B';
//   if (percentage >= 65) return 'C+';
//   if (percentage >= 60) return 'C';
//   if (percentage >= 55) return 'D+';
//   if (percentage >= 50) return 'D';
//   return 'F';
// }

// export function getGradeColor(grade: string): string {
//   if (grade.startsWith('A')) return 'success';
//   if (grade.startsWith('B')) return 'primary';
//   if (grade.startsWith('C')) return 'info';
//   if (grade.startsWith('D')) return 'warning';
//   return 'danger';
// }


// // ScoreColumn
// // services/courses/Score.ts
// export interface ScoreColumn {
//   id?: string;
//   type: 'homework' | 'classwork' | 'assessment' | 'assignment' | 'exam' | 'project';
//   title: string;
//   max_score: number;
//   weight: number;
//   description?: string;
//   order: number;
// }

// export interface ColumnScoreItem {
//   column_id: string;
//   score: number;
//   remarks: string;
// }

// export interface StudentColumnScores {
//   student_id: string;
//   enrollment_id?: string;
//   column_scores: ColumnScoreItem[];
// }

// export interface BulkScoreCreateRequest {
//   lesson_id: string;
//   columns: ScoreColumn[];
//   scores: StudentColumnScores[];
// }




// v5
// src/types/course/score.ts
// Complete type definitions matching backend schema


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
}

export interface LessonScoreResponse {
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

export interface BulkScoreRequest {
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

export const DEFAULT_LESSON_COLUMNS: Omit<ScoreColumn, 'id' | 'lesson_id'>[] = [
  {
    type: 'homework',
    title: 'Homework',
    max_score: 30,
    weight: 0.3,
    order: 1
  },
  {
    type: 'classwork',
    title: 'Classwork',
    max_score: 20,
    weight: 0.2,
    order: 2
  },
  {
    type: 'quiz',
    title: 'Quiz',
    max_score: 50,
    weight: 0.5,
    order: 3
  }
];

export function calculateGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 75) return 'B+';
  if (percentage >= 70) return 'B';
  if (percentage >= 65) return 'C+';
  if (percentage >= 60) return 'C';
  if (percentage >= 55) return 'D+';
  if (percentage >= 50) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'primary';
  if (grade.startsWith('C')) return 'info';
  if (grade.startsWith('D')) return 'warning';
  return 'danger';
}

