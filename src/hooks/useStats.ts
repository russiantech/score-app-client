// =====================================================
// src/hooks/useStats.ts - Custom Hook for Statistics
// =====================================================

import { StatsService } from "@/services/stats/StatService";
import type { AdminStats, TutorStats, StudentStats, ParentStats } from "@/types/stats";
import { useApi } from "./useApi";

export function useAdminStats() {
  return useApi<AdminStats>(
    () => StatsService.getAdminStats(),
    { immediate: true }
  );
}

export function useTutorStats(tutorId: string) {
  return useApi<TutorStats>(
    () => StatsService.getTutorStats(tutorId),
    { immediate: !!tutorId }
  );
}

export function useStudentStats(studentId: string) {
  return useApi<StudentStats>(
    () => StatsService.getStudentStats(studentId),
    { immediate: !!studentId }
  );
}

export function useParentStats(parentId: string) {
  return useApi<ParentStats>(
    () => StatsService.getParentStats(parentId),
    { immediate: !!parentId }
  );
}
