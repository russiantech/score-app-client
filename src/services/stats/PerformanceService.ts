/* =====================================================
   PERFORMANCE SERVICE
===================================================== */

import type { StudentPerformance } from "@/types/performance";
import { handleError } from "@/utils/helpers";
import { AxiosService } from "../base/AxiosService";

export const PerformanceService = {
  async getStudentPerformance(
    studentId: string,
    courseId?: string
  ): Promise<StudentPerformance[]> {
    try {
      const response = await AxiosService.json.get(
        `/students/${studentId}/performance`,
        { params: { courseId } }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getCoursePerformance(courseId: string): Promise<StudentPerformance[]> {
    try {
      const response = await AxiosService.json.get(`/courses/${courseId}/performance`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getChildPerformance(
    parentId: string,
    childId: string,
    courseId?: string
  ): Promise<StudentPerformance[]> {
    try {
      const response = await AxiosService.json.get(
        `/parents/${parentId}/children/${childId}/performance`,
        { params: { courseId } }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
