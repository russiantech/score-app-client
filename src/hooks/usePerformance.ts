// =====================================================
//  src/hooks/usePerformance.ts - Custom Hook for Performance
// =====================================================

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