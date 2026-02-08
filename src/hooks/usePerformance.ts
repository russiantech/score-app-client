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




// // v3
// // src/hooks/usePerformance.ts
// import { useState, useEffect, useCallback } from 'react';
// import toast from 'react-hot-toast';
// import { PerformanceService } from '@/services/performance/PerformanceService';
// import { extractErrorMessage } from '@/utils/helpers';
// import type { StudentPerformance, CoursePerformance } from '@/types/performance';

// // ============================================================================
// // TYPES (unchanged – already good)
// // ============================================================================



// // ============================================================================
// // HOOK
// // ============================================================================

// export const usePerformance = (studentId?: string) => {
//   const [performance, setPerformance] = useState<StudentPerformance | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPerformance = useCallback(
//     async (isRefresh = false) => {
//       if (!studentId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         setError(null);

//         const data = await PerformanceService.getStudentPerformance(studentId);
//         setPerformance(data);
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);

//         if (!isRefresh) {
//           toast.error(message);
//         }
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [studentId]
//   );

//   useEffect(() => {
//     fetchPerformance(false);
//   }, [fetchPerformance]);

//   const refresh = useCallback(async () => {
//     await fetchPerformance(true);
//   }, [fetchPerformance]);

//   const getCoursePerformance = useCallback(
//     (courseId: string): CoursePerformance | undefined =>
//       performance?.courses.find(c => c.course.id === courseId),
//     [performance]
//   );

// /*
//   const exportReport = useCallback(

//     async (format: 'pdf' | 'excel') => {
//       if (!studentId) return;

//       try {
//         toast.loading(`Generating ${format.toUpperCase()} report...`);

//         const blob = await PerformanceService.exportReport(studentId, format);

//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;

//         const ext = format === 'pdf' ? 'pdf' : 'xlsx';
//         link.download = `performance_report_${Date.now()}.${ext}`;

//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);

//         toast.dismiss();
//         toast.success('Report downloaded successfully');
//       } catch (err) {
//         toast.dismiss();
//         toast.error(extractErrorMessage(err));
//       }
//     },
//     [studentId]
//   );
// */

// const exportReport = useCallback(
//   async (format: "pdf" | "excel") => {
//     if (!studentId) return;

//     try {
//       toast.loading(`Generating ${format.toUpperCase()} report...`);

//       const blob = await PerformanceService.exportReport(
//         studentId,
//         format
//       );

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;

//       const ext = format === "pdf" ? "pdf" : "xlsx";
//       link.download = `performance_report_${Date.now()}.${ext}`;

//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       toast.dismiss();
//       toast.success("Report downloaded successfully");
//     } catch (err) {
//       toast.dismiss();
//       toast.error(extractErrorMessage(err));
//     }
//   },
//   [studentId]
// );


// //   // const exportReport = async (format: string) => {
// //   const exportReport = async (format: 'pdf' | 'excel') => {
// //   try {
// //     const response = await fetch('/api/performance/report');
// //     if (!response.ok) throw new Error('Download failed');
    
// //     const blob = await response.blob();
// //     const url = window.URL.createObjectURL(blob);
    
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = 'performance-report.pdf';
// //     document.body.appendChild(a);
// //     a.click();
// //     document.body.removeChild(a);
// //     window.URL.revokeObjectURL(url);
// //   } catch (error) {
// //     console.error('Download error:', error);
// //   }
// // };

// // const handleExport = async (format: 'pdf' | 'excel') => {
// //   try {
// //     setExporting(true);
// //     await PerformanceService.exportReport(format);  // ✅ Now accepts format param
// //     toast.success(`Report exported as ${format.toUpperCase()}`);
// //   } catch (error) {
// //     console.error('Export failed:', error);
// //     toast.error('Failed to export report');
// //   } finally {
// //     setExporting(false);
// //   }
// // };


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




// // v4 - supports many
// // src/hooks/usePerformance.ts
// import { useState, useEffect, useCallback } from "react";
// import toast from "react-hot-toast";
// import { PerformanceService } from "@/services/performance/PerformanceService";
// import { extractErrorMessage } from "@/utils/helpers";
// import type { StudentPerformance, CoursePerformance } from "@/types/performance";

// export const usePerformance = (studentId?: string) => {
//   // Store as array only (recommended approach)
//   const [performance, setPerformance] = useState<StudentPerformance[] | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPerformance = useCallback(
//     async (isRefresh = false) => {
//       if (!studentId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         isRefresh ? setRefreshing(true) : setLoading(true);
//         setError(null);

//         const data = await PerformanceService.getStudentPerformance(studentId);
        
//         // ✅ Normalize to always be array
//         const normalized = Array.isArray(data) ? data : [data];
//         setPerformance(normalized);
//       } catch (err) {
//         const message = extractErrorMessage(err);
//         setError(message);

//         if (!isRefresh) {
//           toast.error(message);
//         }
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [studentId]
//   );

//   useEffect(() => {
//     fetchPerformance(false);
//   }, [fetchPerformance]);

//   const refresh = useCallback(async () => {
//     await fetchPerformance(true);
//   }, [fetchPerformance]);

//   // ✅ FIXED: Access courses property correctly
//   const getCoursePerformance = useCallback(
//     (courseId: string): CoursePerformance | undefined => {
//       if (!performance) return undefined;
      
//       // Search through all student performances
//       for (const studentPerf of performance) {
//         // Find the course within the courses array
//         const coursePerf = studentPerf.courses.find(c => c.course.id === courseId);
//         if (coursePerf) {
//           return coursePerf;
//         }
//       }
      
//       return undefined;
//     },
//     [performance]
//   );

//   const exportReport = useCallback(
//     async (format: "pdf" | "excel") => {
//       if (!studentId) return;

//       try {
//         toast.loading(`Generating ${format.toUpperCase()} report...`);

//         const blob = await PerformanceService.exportReport(studentId, format);

//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;

//         const ext = format === "pdf" ? "pdf" : "xlsx";
//         link.download = `performance_report_${Date.now()}.${ext}`;

//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url);

//         toast.dismiss();
//         toast.success("Report downloaded successfully");
//       } catch (err) {
//         toast.dismiss();
//         toast.error(extractErrorMessage(err));
//       }
//     },
//     [studentId]
//   );

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


// v5
// src/hooks/usePerformance.ts
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { PerformanceService } from "@/services/performance/PerformanceService";
import { extractErrorMessage } from "@/utils/helpers";
import type { StudentPerformance, CoursePerformance } from "@/types/performance";

export const usePerformance = (studentId?: string) => {
  // Store as single object (since we're fetching for one student)
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
        
        // If array is returned, take the first item (single student)
        const normalized = Array.isArray(data) ? data[0] : data;
        setPerformance(normalized || null);
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

  // Fixed to work with single StudentPerformance object
  const getCoursePerformance = useCallback(
    (courseId: string): CoursePerformance | undefined => {
      if (!performance) return undefined;
      
      // StudentPerformance has courses array, find the matching course
      return performance.courses.find(c => c.course.id === courseId);
    },
    [performance]
  );

  const exportReport = useCallback(
    async (format: "pdf" | "excel") => {
      if (!studentId) return;

      try {
        toast.loading(`Generating ${format.toUpperCase()} report...`);

        const blob = await PerformanceService.exportReport(studentId, format);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const ext = format === "pdf" ? "pdf" : "xlsx";
        link.download = `performance_report_${Date.now()}.${ext}`;

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.dismiss();
        toast.success("Report downloaded successfully");
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