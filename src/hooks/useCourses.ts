// =====================================================
// src/hooks/useCourses.ts - Custom Hook for Courses
// =====================================================

import { CourseService } from "@/services/courses/CourseService";
import type { CourseFilter, Course } from "@/types/course";
import { useApi } from "./useApi";

// import { useApi } from './useApi';
// import { CourseService } from '../services';
// import type { Course, CourseFilter } from '@/types';

export function useCourses(filter?: CourseFilter) {
  return useApi<Course[]>(
    () => CourseService.getAll(filter),
    { immediate: true, initialData: [] }
  );
}

export function useCourse(id: string) {
  return useApi<Course>(
    () => CourseService.getById(id),
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
