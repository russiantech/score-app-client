/* =====================================================
   PERFORMANCE TYPES
===================================================== */

import type { Grade, LessonScoreResponse, ScoreType } from "./course/score";


// new
export interface AssessmentScore {
  column_id: string;
  type: string;
  title: string;
  scope_title: string;
  score: number | null;
  max_score: number;
  percentage: number | null;
  grade: string;
  remarks: string;
  recorded_date: string | null;
  is_completed: boolean;
  lesson_id?: string;
  module_id?: string;
  course_id?: string;
}

export interface CoursePerformance {
  enrollment_id: string;
  course: {
    id: string;
    title: string;
    code: string;
  };
  
  modules: number;
  lessons: number;
  students: number;
  tutors: number;

  lesson_scores: AssessmentScore[];
  module_scores: AssessmentScore[];
  course_scores: AssessmentScore[];
  total_assessments: number;
  completed_assessments: number;
  overall_average: number;
  overall_grade: string;
  enrolled_date: string | null;
}

export interface PerformanceSummary {
  total_courses: number;
  total_assessments: number;
  overall_average: number;
  overall_grade: string;
  grade_distribution: Record<string, number>;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  attendance_rate: number;
}

export interface PerformanceTrend {
  month: string;
  average: number;
}

export interface GraduationStatus {
  qualified: boolean;
  status: string;
  message: string;
  criteria: {
    min_average: number;
    min_attendance: number;
    min_completion: number;
  };
  current: {
    average: number;
    attendance: number;
    completion: number;
  };
  criteria_met: {
    academic_performance: boolean;
    attendance: boolean;
    completion: boolean;
  };
  recommendations: string[];
}

export interface StudentPerformance {
  courseId: any;
  overallPercentage: number;
  lessons: any;
  overallGrade: any;
  courseName: string;
  summary: PerformanceSummary;
  courses: CoursePerformance[];
  attendance: AttendanceSummary;
  attendanceDetails?: any;
  trends: PerformanceTrend[];
  graduation_status: GraduationStatus;
  // Optional: Include raw scores for detailed analysis
  scores?: {
    lesson_scores: AssessmentScore[];
    module_scores: AssessmentScore[];
    course_scores: AssessmentScore[];
  };
  // Optional: Include error details if fetching performance data fails
  error?: string;

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
  type: ScoreType;
  // score?: ScoreColumn;
  // score?: StudentScoreData;
  scores?: LessonScoreResponse;
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


// for performance modals and components & props
export interface GraduationBannerProps {
  status: GraduationStatus;
}

export interface OverviewTabProps {
  courses: CoursePerformance[];
  summary: PerformanceSummary;
  trends: PerformanceTrend[];
}


export interface SimpleBarChartProps {
  courses: CoursePerformance[];
}

export interface SimpleTrendChartProps {
  data: PerformanceTrend[];
}