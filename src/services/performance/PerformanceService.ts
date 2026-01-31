// // src/services/performance/PerformanceService.ts
// /**
//  * Frontend service for student performance data
//  */

// import { AxiosService as api } from '@/services/base/AxiosService';
// import type { PerformanceData } from '@/hooks/usePerformance';

// export class PerformanceService {
//   /**
//    * Get comprehensive performance data for a student
//    */
//   static async getStudentPerformance(student_id: string): Promise<PerformanceData> {
//     const response = await api.json.get(`/performance/students/${student_id}`);
//     return response.data.data;
//   }

//   /**
//    * Get performance for a specific course
//    */
//   static async getCoursePerformance(
//     studentId: string,
//     courseId: string
//   ): Promise<any> {
//     const response = await api.json.get(
//       `/performance/students/${studentId}/courses/${courseId}`
//     );
//     return response.data.data;
//   }

//   /**
//    * Export performance report
//    */
//   static async exportReport(
//     studentId: string,
//     format: 'pdf' | 'excel'
//   ): Promise<void> {
//     const response = await api.json.get(
//       `/performance/students/${studentId}/export`,
//       {
//         params: { format },
//         responseType: 'blob'
//       }
//     );

//     // Create download link
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `performance_report.${format}`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   }
// }

// export default PerformanceService;


// // v2
// // src/services/performance/PerformanceService.ts
// /**
//  * Frontend service for student performance data
//  */

// import { AxiosService as api } from '@/services/base/AxiosService';
// // import PerformanceData from '@/hooks/usePerformance';
// import type { PerformanceData } from '@/hooks/usePerformance';

// export class PerformanceService {
//   /**
//    * Get comprehensive performance data for a student
//    */
//   static async getStudentPerformance(student_id: string): Promise<PerformanceData> {
//     const response = await api.json.get(`/performance/students/${student_id}`);
//     return response.data;
//   }

//   /**
//    * Get performance for a specific course
//    */
//   static async getCoursePerformance(
//     studentId: string,
//     courseId: string
//   ): Promise<any> {
//     const response = await api.json.get(
//       `/performance/students/${studentId}/courses/${courseId}`
//     );
//     return response.data;
//   }

//   /**
//    * Export performance report
//    */
//   static async exportReport(
//     studentId: string,
//     format: 'pdf' | 'excel'
//   ): Promise<void> {
//     const response = await api.json.get(
//       `/performance/students/${studentId}/export/${format}`,
//       {
//         params: { format },
//         responseType: 'blob'
//       }
//     );

//     // Create download link
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `performance_report.${format}`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   }
// }

// export default PerformanceService;



// v3
// src/services/performance/PerformanceService.ts

import { AxiosService as api } from '@/services/base/AxiosService';
import type { PerformanceData } from '@/hooks/usePerformance';

export class PerformanceService {
  /**
   * Get comprehensive performance data for a student
   */
  static async getStudentPerformance(
    student_id: string
  ): Promise<PerformanceData> {
    const response = await api.json.get(
      `/performance/students/${student_id}`
    );
    return response.data;
  }

  /**
   * Export performance report (PDF or Excel)
   */
  static async exportReport(
    studentId: string,
    format: 'pdf' | 'excel'
  ): Promise<void> {
    const response = await api.json.get(
      `/performance/students/${studentId}/export/${format}`,
      {
        responseType: 'blob'
      }
    );

    // ✅ Axios already gives us a Blob
    const blob = response.data as Blob;

    // ✅ Correct extensions
    const extension = format === 'pdf' ? 'pdf' : 'xls';
    const mimeType =
      format === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.ms-excel';

    const file = new Blob([blob], { type: mimeType });

    const url = window.URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = url;
    link.download = `performance_report_${studentId}.${extension}`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export default PerformanceService;
