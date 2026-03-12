// src/services/idcard/IDCardService.ts
// import { api } from '../api';
// import { UseApiReturn } from '@/types/users';
import { AxiosService as api } from '@/services/base/AxiosService';
import type { IDCardData, CourseEnrollment } from '@/types/idcard';

export class IDCardService {
//   private static baseUrl = '/api/v1/id-cards';

  static async getStudentData(studentId: string): Promise<{
    student: any;
    courses: CourseEnrollment[];
  }> {
    const response = await api.json.get(`/students/${studentId}/data`);
    // const response = await api.json.get(`/students/${studentId}`);
    // const response = await api.json.get(`/students/${studentId}/generate`);
    return response.data.data;
  }

  static async uploadPhoto(studentId: string, photoFile: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await api.multipart.post(`/students/${studentId}/upload-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  static async getCardData(
    studentId: string,
    courseId: string
  ): Promise<IDCardData> {
    const response = await api.json.get(`/students/${studentId}/generate-pdf`,
      { params: { course_id: courseId } }
    );
    return response.data;
  }
}

