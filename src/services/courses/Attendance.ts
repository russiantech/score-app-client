// /* =====================================================
//    ATTENDANCE SERVICE
// ===================================================== 

import type { AttendanceResponse, AttendanceBulkCreate } from '@/types/course/attendance';
import { AxiosService as api } from '../base/AxiosService';

export class AttendanceService {
  /**
   * Get attendance data for a lesson with all enrolled students
   * Backend validates enrollment automatically
   */
  static async getByLesson(
    lessonId: string,
    page: number = 1,
    pageSize: number = 100
  ): Promise<AttendanceResponse> {
    const response = await api.json.get(`/attendance/${lessonId}/lesson`, {
      params: { page, page_size: pageSize }
    });
    return response.data.data;
  }

  /**
   * Bulk create/update attendance for a lesson
   * Backend validates that students are enrolled before saving
   */
  static async bulkCreate(data: AttendanceBulkCreate): Promise<{
    created: number;
    updated: number;
  }> {
    const response = await api.json.post('/attendance/bulk', data);
    return response.data.data;
  }

  /**
   * Get attendance statistics for a lesson
   */
  static async getStats(lessonId: string): Promise<{
    total: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendance_rate: number;
  }> {
    const response = await api.json.get(`/attendance/${lessonId}/stats`);
    return response.data.data;
  }
}

export default AttendanceService;

