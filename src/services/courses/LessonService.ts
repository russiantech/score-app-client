/* =====================================================
   LESSON SERVICE
===================================================== */

import type { Assessment } from "@/types/course/assessment";
import type { Lesson, CreateLessonDTO, UpdateLessonDTO } from "@/types/course/lesson";
import { handleError } from "@/utils/helpers";
import { AxiosService } from "../base/AxiosService";

export const LessonService = {
  async getById(id: string): Promise<Lesson> {
    try {
      const response = await AxiosService.json.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async create(data: CreateLessonDTO): Promise<Lesson> {
    try {
      const response = await AxiosService.json.post('/lessons', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async update(id: string, data: UpdateLessonDTO): Promise<Lesson> {
    try {
      const response = await AxiosService.json.patch(`/lessons/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/lessons/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  async getAssessments(lessonId: string): Promise<Assessment[]> {
    try {
      const response = await AxiosService.json.get(`/lessons/${lessonId}/assessments`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async reorder(courseId: string, lessonOrders: { id: string; order: number }[]): Promise<void> {
    try {
      await AxiosService.json.put(`/courses/${courseId}/lessons/reorder`, { lessonOrders });
    } catch (error) {
      throw handleError(error);
    }
  },
};
