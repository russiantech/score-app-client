/* =====================================================
   PERFORMANCE TYPES
===================================================== */

import type { AssessmentType } from "./course/assessment";
import type { Grade, Score } from "./course/score";

export type CoursePerformance = {
  modules: number;
  lessons: number;
  students: number;
  tutors: number;
};


export interface StudentPerformance {
  courseId: string;
  courseName: string;
  courseCode: string;
  tutorName?: string;
  lessons: LessonPerformance[];
  overallPercentage: number;
  overallGrade: Grade;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  completedAssessments: number;
  totalAssessments: number;
}

export interface LessonPerformance {
  lessonId: string;
  lessonTitle: string;
  lessonOrder: number;
  assessments: AssessmentPerformance[];
  averageScore: number;
  averagePercentage: number;
  averageGrade?: Grade;
  isCompleted: boolean;
}

export interface AssessmentPerformance {
  assessmentId: string;
  assessmentTitle: string;
  type: AssessmentType;
  score?: Score;
  status: 'completed' | 'pending' | 'graded' | 'not-submitted' | 'overdue';
  dueDate?: string;
  submittedAt?: string;
  isLate?: boolean;
  maxAttempts?: number;
  attemptsTaken?: number;
}

export interface PerformanceTrend {
  date: string;
  averageScore: number;
  grade: Grade;
  assessmentCount: number;
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  grade: Grade;
  totalAssessments: number;
  trend: 'improving' | 'declining' | 'stable';
}
