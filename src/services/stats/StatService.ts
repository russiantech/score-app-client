/* =====================================================
   STATS SERVICE
===================================================== */

import type { AdminStats, TutorStats, StudentStats, ParentStats } from "@/types/stats";
import { handleError } from "@/utils/helpers";
import { AxiosService } from "@/services/base/AxiosService";

export const StatsService = {
  async getAdminStats(): Promise<AdminStats> {
    try {
      const response = await AxiosService.json.get('/stats/admin');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getTutorStats(tutorId: string): Promise<TutorStats> {
    try {
      const response = await AxiosService.json.get(`/stats/tutor/${tutorId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getStudentStats(studentId: string): Promise<StudentStats> {
    try {
      const response = await AxiosService.json.get(`/stats/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getParentStats(parentId: string): Promise<ParentStats> {
    try {
      const response = await AxiosService.json.get(`/stats/parent/${parentId}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

