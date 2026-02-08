// =====================================================
// src/hooks/useCourses.ts - Custom Hook for Courses
// =====================================================

import { CourseService } from "@/services/courses/CourseService";
import type { CourseFilters, Course } from "@/types/course";
import { useApi } from "./useApi";

export function useCourses(filter?: CourseFilters) {
  return useApi<Course[]>(
    () => CourseService.getAll(filter),
    { immediate: true, initialData: [] }
  );
}

export function useCourse(id: string) {
  return useApi<Course>(
    async () => {
      const response = await CourseService.getById(id);
      return response.course;
    },
    { immediate: !!id }
  );
}

export function useCreateCourse() {
  return useApi(CourseService.create);
}

export function useUpdateCourse() {
  return useApi((id: string, data: any) => CourseService.update(id, data));
}

export function useDeleteCourse() {
  return useApi(CourseService.delete);
}
