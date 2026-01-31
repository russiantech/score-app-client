// =====================================================
// src/hooks/useAssessments.ts - Custom Hook for Assessments
// =====================================================

import { AssessmentService } from "@/services/courses/Assessment";
import { LessonService } from "@/services/courses/LessonService";
import type { Assessment } from "@/types/course/assessment";
import { useApi } from "./useApi";

export function useAssessment(id: string) {
  return useApi<Assessment>(
    () => AssessmentService.getById(id),
    { immediate: !!id }
  );
}

export function useLessonAssessments(lessonId: string) {
  return useApi<Assessment[]>(
    () => LessonService.getAssessments(lessonId),
    { immediate: !!lessonId, initialData: [] }
  );
}

export function useCreateAssessment() {
  return useApi(AssessmentService.create);
}

export function useUpdateAssessment() {
  return useApi((id: string, data: any) => AssessmentService.update(id, data));
}

export function useDeleteAssessment() {
  return useApi(AssessmentService.delete);
}
