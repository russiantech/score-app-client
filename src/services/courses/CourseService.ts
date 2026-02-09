/* =====================================================
   COURSE SERVICE
===================================================== */

import type { Enrollment } from "@/types/enrollment";
import type { Lesson } from "@/types/course/lesson";
import { handleError } from "@/utils/helpers";
import { AxiosService } from "@/services/base/AxiosService";
import type { CoursePerformance } from "@/types/performance";
import type { Course, CourseFilters, CreateCourseDTO, UpdateCourseDTO } from "@/types/course";


export const CourseService = {
  
  async getAll(filter?: CourseFilters): Promise<Course[]> {
    try {
      const response = await AxiosService.json.get('/courses', { params: filter });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },


    async getById(
          courseId: string,
          options?: { include_relations?: boolean }
          ): Promise<{
          course: Course;
          // modules: Module[];
          }> {
          try {
              const response = await AxiosService.json.get(
              `/courses/${courseId}`,
              {
                  params: {
                  include_relations: options?.include_relations ?? false,
                  },
              }
              );
  
              return response.data.data;
          } catch (error) {
              throw handleError(error);
          }
          },

  async create(data: CreateCourseDTO): Promise<Course> {
    try {
      const response = await AxiosService.json.post('/courses', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async update(id: string, data: UpdateCourseDTO): Promise<Course> {
    try {
      const response = await AxiosService.json.put(`/courses/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/courses/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  async getLessons(courseId: string): Promise<Lesson[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/lessons`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getEnrollments(courseId: string): Promise<Enrollment[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/enrollments`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getPerformance(courseId: string): Promise<CoursePerformance[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/performance`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

};

export default CourseService;