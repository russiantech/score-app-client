// ============================================================================
// SERVICE: AdminService.ts
// Admin Dashboard & Management Data Service
// ============================================================================

import type { ApiResponse } from '@/types';
// import type { User } from '@/types/auth';
// import type { Course } from '@/types/course';
import type { AdminStats, RecentActivity } from '@/types/stats';

import { AxiosService } from '@/services/base/AxiosService';

/* =====================================================
   Error Normalization (Consistent Across Services)
===================================================== */

const extractErrorMessage = (error: unknown): string => {
  const err = error as any;

  return (
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    err?.message ||
    'An unexpected admin operation error occurred'
  );
};

const handleError = (error: unknown): Error => {
  return new Error(extractErrorMessage(error));
};

/* =====================================================
   Admin Service
===================================================== */

export const AdminService = {
  /* ================= DASHBOARD ================= */

  async getStats(): Promise<AdminStats> {
    try {
      const response = await AxiosService.json.get<ApiResponse<AdminStats>>(
        '/admin/stats'
      );
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const response =
        await AxiosService.json.get<ApiResponse<RecentActivity[]>>(
          '/admin/activities',
          { params: { limit } }
        );
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getDashboardOverview(): Promise<{
    stats: AdminStats;
    activities: RecentActivity[];
  }> {
    try {
      const response = await AxiosService.json.get<
        ApiResponse<{
          stats: AdminStats;
          activities: RecentActivity[];
        }>
      >('/admin/dashboard');

      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /* ================= COURSES ================= */

  // Uncomment when needed
  /*
  async getCourses(): Promise<Course[]> {
    try {
      const response = await AxiosService.json.get<ApiResponse<Course[]>>(
        '/admin/courses'
      );
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async updateCourse(
    courseId: string,
    payload: Partial<Course>
  ): Promise<Course> {
    try {
      const response = await AxiosService.json.put<ApiResponse<Course>>(
        `/admin/courses/${courseId}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  */

  /* ================= TUTORS ================= */

  // Uncomment when needed
  /*
  async getTutors(): Promise<User[]> {
    try {
      const response = await AxiosService.json.get<ApiResponse<User[]>>(
        '/admin/tutors'
      );
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  */

  /* ================= ASSIGNMENTS ================= */

  async assignTutorToCourse(
    tutorId: string,
    courseId: string
  ): Promise<ApiResponse> {
    try {
      const response = await AxiosService.json.post<ApiResponse>(
        '/courses/assign-tutor',
        { tutorId, courseId }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async unassignTutorFromCourse(
    courseId: string
  ): Promise<ApiResponse> {
    try {
      const response = await AxiosService.json.post<ApiResponse>(
        `/admin/courses/${courseId}/unassign-tutor`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

export default AdminService;
