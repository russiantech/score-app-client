// =====================================================
// src/hooks/useEnrollments.ts - Custom Hook for Enrollments
// =====================================================

import { EnrollmentService } from "@/services/courses/Enrollment";
import type { Enrollment } from "@/types/enrollment";
import { useApi } from "./useApi";

export function useStudentEnrollments(studentId: string) {
  
  return useApi<Enrollment[]>(
    () => EnrollmentService.getByStudent(studentId),
    { immediate: !!studentId, initialData: [] }
  );
}

export function useCourseEnrollments(courseId: string) {
  return useApi<Enrollment>(
    () => EnrollmentService.getById(courseId),
    { immediate: !!courseId }
  );
}

export function useEnrollStudent() {
  return useApi(EnrollmentService.create);
}

export function useUnenrollStudent() {
  return useApi(EnrollmentService.delete);
}
