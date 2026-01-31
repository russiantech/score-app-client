// // =====================================================
// // src/hooks/usePerformance.ts - Custom Hook for Performance
// // =====================================================

// import { PerformanceService } from "@/services/stats/PerformanceService";
// import type { StudentPerformance } from "@/types/performance";
// import { useApi } from "./useApi";

// export function useStudentPerformance(studentId: string, courseId?: string) {
//   return useApi<StudentPerformance[]>(
//     () => PerformanceService.getStudentPerformance(studentId, courseId),
//     { immediate: !!studentId, initialData: [] }
//   );
// }

// export function useCoursePerformance(courseId: string) {
//   return useApi<StudentPerformance[]>(
//     () => PerformanceService.getCoursePerformance(courseId),
//     { immediate: !!courseId, initialData: [] }
//   );
// }

// export function useChildPerformance(parentId: string, childId: string, courseId?: string) {
//   return useApi<StudentPerformance[]>(
//     () => PerformanceService.getChildPerformance(parentId, childId, courseId),
//     { immediate: !!parentId && !!childId, initialData: [] }
//   );
// }



// // v2
// // src/hooks/usePerformance.ts
// /**
//  * Custom hook for managing student performance data
//  * Provides loading states, error handling, and data fetching
//  */

// import { useState, useEffect, useCallback } from 'react';
// import toast from 'react-hot-toast';
// import { PerformanceService } from '@/services/performance/PerformanceService';

// export interface PerformanceSummary {
//   total_courses: number;
//   total_assessments: number;
//   overall_average: number;
//   overall_grade: string;
//   grade_distribution: {
//     A: number;
//     B: number;
//     C: number;
//     D: number;
//     F: number;
//   };
// }

// export interface AttendanceSummary {
//   total: number;
//   present: number;
//   absent: number;
//   late: number;
//   attendance_rate: number;
// }

// export interface Score {
//   id: string;
//   type: string;
//   title: string;
//   score: number;
//   max_score: number;
//   percentage: number;
//   grade: string;
//   recorded_date: string | null;
//   feedback?: string;
// }

// export interface CoursePerformance {
//   enrollment_id: string;
//   course: {
//     id: string;
//     title: string;
//     code: string;
//   };
//   lesson_scores: Score[];
//   module_scores: Score[];
//   course_scores: Score[];
//   total_assessments: number;
//   overall_average: number;
//   overall_grade: string;
//   enrolled_date: string | null;
// }

// export interface PerformanceTrend {
//   month: string;
//   average: number;
// }

// export interface PerformanceData {
//   summary: PerformanceSummary;
//   courses: CoursePerformance[];
//   attendance: AttendanceSummary;
//   trends: PerformanceTrend[];
// }

// interface UsePerformanceReturn {
//   // Data
//   performance: PerformanceData | null;
  
//   // Loading states
//   loading: boolean;
//   refreshing: boolean;
  
//   // Error state
//   error: string | null;
  
//   // Actions
//   refresh: () => Promise<void>;
//   getCoursePerformance: (courseId: string) => CoursePerformance | undefined;
//   exportReport: (format: 'pdf' | 'excel') => Promise<void>;
// }

// export const usePerformance = (studentId?: string): UsePerformanceReturn => {
//   const [performance, setPerformance] = useState<PerformanceData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPerformance = useCallback(async (isRefresh = false) => {
//     if (!studentId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       if (isRefresh) {
//         setRefreshing(true);
//       } else {
//         setLoading(true);
//       }
      
//       setError(null);

//       const data = await PerformanceService.getStudentPerformance(studentId);
//       setPerformance(data);
      
//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to load performance data';
//       setError(errorMessage);
      
//       if (!isRefresh) {
//         toast.error(errorMessage);
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [studentId]);

//   // Initial load
//   useEffect(() => {
//     fetchPerformance(false);
//   }, [fetchPerformance]);

//   // Refresh function
//   const refresh = useCallback(async () => {
//     await fetchPerformance(true);
//   }, [fetchPerformance]);

//   // Get specific course performance
//   const getCoursePerformance = useCallback((courseId: string): CoursePerformance | undefined => {
//     return performance?.courses.find(c => c.course.id === courseId);
//   }, [performance]);

//   // Export report
//   const exportReport = useCallback(async (format: 'pdf' | 'excel') => {
//     if (!studentId) return;

//     try {
//       toast.loading(`Generating ${format.toUpperCase()} report...`);
      
//       await PerformanceService.exportReport(studentId, format);
      
//       toast.dismiss();
//       toast.success(`Report downloaded successfully`);
//     } catch (err: any) {
//       toast.dismiss();
//       toast.error(err.message || 'Failed to generate report');
//     }
//   }, [studentId]);

//   return {
//     performance,
//     loading,
//     refreshing,
//     error,
//     refresh,
//     getCoursePerformance,
//     exportReport
//   };
// };

// export default usePerformance;




// v3
// src/hooks/usePerformance.ts
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { PerformanceService } from '@/services/performance/PerformanceService';
import { extractErrorMessage } from '@/utils/helpers';

// ============================================================================
// TYPES (unchanged – already good)
// ============================================================================

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
  summary: PerformanceSummary;
  courses: CoursePerformance[];
  attendance: AttendanceSummary;
  trends: PerformanceTrend[];
  graduation_status: GraduationStatus;
}

// ============================================================================
// HOOK
// ============================================================================

export const usePerformance = (studentId?: string) => {
  const [performance, setPerformance] = useState<StudentPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPerformance = useCallback(
    async (isRefresh = false) => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        setError(null);

        const data = await PerformanceService.getStudentPerformance(studentId);
        setPerformance(data);
      } catch (err) {
        const message = extractErrorMessage(err);
        setError(message);

        if (!isRefresh) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [studentId]
  );

  useEffect(() => {
    fetchPerformance(false);
  }, [fetchPerformance]);

  const refresh = useCallback(async () => {
    await fetchPerformance(true);
  }, [fetchPerformance]);

  const getCoursePerformance = useCallback(
    (courseId: string): CoursePerformance | undefined =>
      performance?.courses.find(c => c.course.id === courseId),
    [performance]
  );

  const exportReport = useCallback(
    async (format: 'pdf' | 'excel') => {
      if (!studentId) return;

      try {
        toast.loading(`Generating ${format.toUpperCase()} report...`);

        const blob = await PerformanceService.exportReport(studentId, format);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const ext = format === 'pdf' ? 'pdf' : 'xlsx';
        link.download = `performance_report_${Date.now()}.${ext}`;

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.dismiss();
        toast.success('Report downloaded successfully');
      } catch (err) {
        toast.dismiss();
        toast.error(extractErrorMessage(err));
      }
    },
    [studentId]
  );

  return {
    performance,
    loading,
    refreshing,
    error,
    refresh,
    getCoursePerformance,
    exportReport
  };
};

export default usePerformance;
