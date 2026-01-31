// =====================================================
// src/hooks/useLessons.ts - Custom Hook for Lessons
// =====================================================

import { CourseService } from "@/services/courses/CourseService";
import { LessonService } from "@/services/courses/LessonService";
import type { Lesson } from "@/types/course/lesson";
import { useApi } from "./useApi";

export function useLesson(id: string) {
  return useApi<Lesson>(
    () => LessonService.getById(id),
    { immediate: !!id }
  );
}

export function useCourseLessons(courseId: string) {
  return useApi<Lesson[]>(
    () => CourseService.getLessons(courseId),
    { immediate: !!courseId, initialData: [] }
  );
}

export function useCreateLesson() {
  return useApi(LessonService.create);
}

export function useUpdateLesson() {
  return useApi((id: string, data: any) => LessonService.update(id, data));
}

export function useDeleteLesson() {
  return useApi(LessonService.delete);
}
