// /* =====================================================
//    ATTENDANCE SERVICE
// ===================================================== */
// import type {
//   Attendance,
//   AttendanceCreate,
//   AttendanceUpdate,
//   AttendanceBulkCreate,
// } from "@/types/course/attendance";
// import { handleError } from "@/utils/helpers";
// import { AxiosService } from "../base/AxiosService";

// export const AttendanceService = {
//   /**
//    * Get all attendances for a lesson
//    */
//   async getByLesson(lessonId: string): Promise<Attendance[]> {
//     try {
//       const response = await AxiosService.json.get(
//         `/attendance/${lessonId}/lesson`
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Get attendance for a specific student in a lesson
//    */
//   async getByLessonAndStudent(
//     lessonId: string,
//     studentId: string
//   ): Promise<Attendance> {
//     try {
//       const response = await AxiosService.json.get(
//         `/attendances/lesson/${lessonId}/student/${studentId}`
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Create a single attendance record
//    */
//   async create(data: AttendanceCreate): Promise<Attendance> {
//     try {
//       const response = await AxiosService.json.post("/attendances", data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Bulk create/update attendance records
//    */
//   async bulkCreate(
//     data: AttendanceBulkCreate
//   ): Promise<{
//     created: number;
//     updated: number;
//     attendances: Attendance[];
//   }> {
//     try {
//       const response = await AxiosService.json.post(
//         "/attendances/bulk",
//         data
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Update an attendance record
//    */
//   async update(
//     attendanceId: string,
//     data: AttendanceUpdate
//   ): Promise<Attendance> {
//     try {
//       const response = await AxiosService.json.patch(
//         `/attendances/${attendanceId}`,
//         data
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Delete an attendance record
//    */
//   async delete(attendanceId: string): Promise<void> {
//     try {
//       await AxiosService.json.delete(`/attendances/${attendanceId}`);
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Get attendance statistics for a lesson
//    */
//   async getStats(lessonId: string): Promise<{
//     total: number;
//     present: number;
//     absent: number;
//     late: number;
//     excused: number;
//     attendance_rate: number;
//   }> {
//     try {
//       const response = await AxiosService.json.get(
//         `/lessons/${lessonId}/attendance-stats`
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },
// };




// v2
// src/services/courses/attendance.ts
// import api from '@/services/api';
// import type { AttendanceResponse, AttendanceBulkCreate } from '@/types/attendance';

// export type { StudentAttendanceData } from '@/types/attendance';
import type { AttendanceResponse, AttendanceBulkCreate } from '@/types/course/attendance';
import { AxiosService as api } from '../base/AxiosService';
import { handleError } from '@/utils/helpers';

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

