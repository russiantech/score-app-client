// // src/services/performance/PerformanceService.ts
// /**
//  * Frontend service for student performance data
//  */

// v3
import type { StudentPerformance } from "@/types/performance";
import { AxiosService as api, AxiosService } from "@/services/base/AxiosService";
// src/services/performance/PerformanceService.ts
export class PerformanceService {
  /**
   * Get comprehensive performance data for a student
   */
  static async getStudentPerformance(
    studentId: string
  ): Promise<StudentPerformance[]> {
    const response = await api.json.get(
      `/performance/students/${studentId}`
    );
    return response.data;
  }

  async getStudentPerformance(studentId: string): Promise<StudentPerformance> {
  const res = await AxiosService.json.get(`/performance/${studentId}`);

  const data = res.data;

  // normalize once
  if (Array.isArray(data)) {
    return data[0]; // or throw if empty
  }

  return data;
}

  /**
   * Get performance for a specific course
   */
  static async getStudentCoursePerformance(
    studentId: string,
    courseId: string
  ): Promise<StudentPerformance> {
    const response = await AxiosService.json.get(
      `/performance/students/${studentId}/courses/${courseId}`
    );
    return response.data;
  }

  /**
   * Export performance report
   */
  /*
  static async exportReport(
    studentId: string,
    format: "pdf" | "excel"
  ): Promise<void> {
    const response = await api.json.get(
      `/performance/students/${studentId}/export/${format}`,
      {
        responseType: "blob",
      }
    );
  

    const blob = response.data as Blob;

    const extension = format === "pdf" ? "pdf" : "xlsx";

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `performance_report_${studentId}.${extension}`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }
*/


  /**
   * Export performance report - returns Blob for caller to handle
   */
  static async exportReport(
  studentId: string,
  format: "pdf" | "excel"
): Promise<Blob> {
  const response = await AxiosService.json.get(
    `/performance/students/${studentId}/export/${format}`,
    {
      responseType: "blob",
    }
  );

  return response.data as Blob;
}

}

export default PerformanceService;
