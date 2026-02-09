// /* =====================================================
//    ASSESSMENT TYPES
// ===================================================== */

// export type AssessmentType = 'quiz' | 'assignment' | 'exam' | 'project';
// export type AssessmentStatus = 'draft' | 'published' | 'closed';

// export interface Assessment {
//   id: string;
//   lessonId: string;
//   lessonTitle?: string;
//   courseId?: string;
//   courseName?: string;
//   title: string;
//   description: string;
//   instructions?: string;
//   type: AssessmentType;
//   totalMarks: number;
//   passingMarks: number;
//   duration?: number; // in minutes
//   dueDate?: string;
//   status: AssessmentStatus;
//   questions?: AssessmentQuestion[];
//   allowLateSubmission: boolean;
//   maxAttempts?: number;
//   createdAt: string;
//   updatedAt: string;
//   createdBy?: string;
// }

// export interface AssessmentQuestion {
//   id: string;
//   question: string;
//   type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
//   options?: string[];
//   correctAnswer?: string;
//   marks: number;
//   order: number;
// }

// export interface CreateAssessmentDTO {
//   lessonId: string;
//   title: string;
//   description: string;
//   instructions?: string;
//   type: AssessmentType;
//   totalMarks: number;
//   passingMarks: number;
//   duration?: number;
//   dueDate?: string;
//   status?: AssessmentStatus;
//   questions?: Omit<AssessmentQuestion, 'id'>[];
//   allowLateSubmission?: boolean;
//   maxAttempts?: number;
// }

// export interface UpdateAssessmentDTO extends Partial<CreateAssessmentDTO> {}

// export interface AssessmentSubmission {
//   id: string;
//   assessmentId: string;
//   studentId: string;
//   answers: Record<string, any>;
//   submittedAt: string;
//   isLate: boolean;
//   attemptNumber: number;
// }



// v2
// src/types/assessment.ts
// import type { ReactNode } from "react";

// export interface Assessment {
//   optional: boolean;
//   weight: number;
//   label: ReactNode;
//   color: any;
//   maxScore: ReactNode;
//   id: string;
//   lesson_id: string;
//   title: string;
//   description?: string;
//   type: 'quiz' | 'test' | 'practical' | 'oral';
//   max_score: number;
//   due_date?: string;
//   duration?: string; // e.g., "45 minutes"
//   is_published: boolean;
//   created_at?: string;
//   updated_at?: string;
// }

export interface Assessment {
  id: string;
  lesson_id: string;
  title: string;
  max_score: number;  //  Ensure this is number, not ReactNode
  is_published: boolean;
  type: 'quiz' | 'test' | 'practical' | 'oral' | 'assess' | 'assign' | 'project' | 'exam';
  label: string;
  // maxScore: number;  // Add this if missing
  weight: number;
  description?: string;
  color: string;
  optional?: boolean;
}

export type AssessmentConfig = Omit<
  Assessment,
  'lesson_id' | 'title' | 'is_published'
>;


export interface CreateAssessmentDTO {
  lesson_id: string;
  title: string;
  description?: string;
  type: 'quiz' | 'test' | 'practical' | 'oral';
  max_score: number;
  due_date?: string;
  duration?: string;
  is_published?: boolean;
}

export interface UpdateAssessmentDTO extends Partial<CreateAssessmentDTO> {
  title?: string;
  description?: string;
  type?: 'quiz' | 'test' | 'practical' | 'oral';
  max_score?: number;
  due_date?: string;
  duration?: string;
  is_published?: boolean;
}

// src/types/assignment.ts

export interface Assignment {
  id: string;
  lesson_id: string;
  title: string;
  description?: string;
  instructions?: string;
  max_score: number;
  due_date?: string;
  submission_type: 'file' | 'text' | 'link' | 'mixed';
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AssignmentCreate {
  lesson_id: string;
  title: string;
  description?: string;
  instructions?: string;
  max_score: number;
  due_date?: string;
  submission_type: 'file' | 'text' | 'link' | 'mixed';
  is_published?: boolean;
}

export interface AssignmentUpdate {
  title?: string;
  description?: string;
  instructions?: string;
  max_score?: number;
  due_date?: string;
  submission_type?: 'file' | 'text' | 'link' | 'mixed';
  is_published?: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name?: string;
  content?: string;
  file_url?: string;
  link?: string;
  submitted_at?: string;
  score?: number;
  feedback?: string;
  graded_at?: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
}

// src/types/project.ts

export interface Project {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  instructions?: string;
  max_score: number;
  start_date?: string;
  due_date?: string;
  submission_type: 'file' | 'link' | 'presentation' | 'mixed';
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreate {
  course_id: string;
  title: string;
  description?: string;
  instructions?: string;
  max_score: number;
  start_date?: string;
  due_date?: string;
  submission_type: 'file' | 'link' | 'presentation' | 'mixed';
  is_published?: boolean;
}

export interface ProjectUpdate {
  title?: string;
  description?: string;
  instructions?: string;
  max_score?: number;
  start_date?: string;
  due_date?: string;
  submission_type?: 'file' | 'link' | 'presentation' | 'mixed';
  is_published?: boolean;
}

export interface ProjectSubmission {
  id: string;
  project_id: string;
  student_id: string;
  student_name?: string;
  content?: string;
  file_url?: string;
  link?: string;
  submitted_at?: string;
  score?: number;
  feedback?: string;
  graded_at?: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
}

// src/types/exam.ts

export interface Exam {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  exam_type: 'midterm' | 'final' | 'quiz' | 'practical';
  max_score: number;
  exam_date?: string;
  duration: string; // e.g., "2 hours"
  location?: string;
  instructions?: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamCreate {
  module_id: string;
  title: string;
  description?: string;
  exam_type: 'midterm' | 'final' | 'quiz' | 'practical';
  max_score: number;
  exam_date?: string;
  duration: string;
  location?: string;
  instructions?: string;
  is_published?: boolean;
}

export interface ExamUpdate {
  title?: string;
  description?: string;
  exam_type?: 'midterm' | 'final' | 'quiz' | 'practical';
  max_score?: number;
  exam_date?: string;
  duration?: string;
  location?: string;
  instructions?: string;
  is_published?: boolean;
}

export interface ExamScore {
  id: string;
  exam_id: string;
  student_id: string;
  student_name?: string;
  score: number;
  max_score: number;
  percentage?: number;
  grade?: string;
  remarks?: string;
  graded_at?: string;
}
