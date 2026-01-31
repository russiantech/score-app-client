// /* =====================================================
//    ENROLLMENT SERVICE
// ===================================================== */

// import type { Enrollment, CreateEnrollmentDTO, UpdateEnrollmentDTO } from "@/types/enrollment";
// import { handleError } from "@/utils/helpers";
// import { AxiosService } from "../base/AxiosService";

// export const EnrollmentService = {
//   async getAll(): Promise<Enrollment[]> {
//     try {
//       const response = await AxiosService.json.get('/enrollments');
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getById(id: string): Promise<Enrollment> {
//     try {
//       const response = await AxiosService.json.get(`/enrollments/${id}`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async create(data: CreateEnrollmentDTO): Promise<Enrollment> {
//     try {
//       const response = await AxiosService.json.post('/enrollments', data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async update(id: string, data: UpdateEnrollmentDTO): Promise<Enrollment> {
//     try {
//       const response = await AxiosService.json.put(`/enrollments/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async delete(id: string): Promise<void> {
//     try {
//       await AxiosService.json.delete(`/enrollments/${id}`);
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getByStudent(studentId: string): Promise<Enrollment[]> {
//     try {
//       const response = await AxiosService.json.get(`/students/${studentId}/enrollments`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getByCourse(courseId: string): Promise<Enrollment[]> {
//     try {
//       const response = await AxiosService.json.get(`/courses/${courseId}/enrollments`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },
// };


/* =====================================================
   ENROLLMENT SERVICE
   ===================================================== */

// import type {
//   Enrollment,
//   EnrollmentFilters,
//   EnrollmentCreate,
// } from '@/types/enrollment';

import { handleError } from '@/utils/helpers';
import { AxiosService } from '../base/AxiosService';
import type { Enrollment, EnrollmentCreate, EnrollmentFilters } from '@/types/enrollment';

export const EnrollmentService = {
  /**
   * Get all enrollments with optional filters and pagination
   */
  async getAll(filters?: EnrollmentFilters): Promise<Enrollment[]> {
    try {
      const params = new URLSearchParams();

      if (filters) {
        // Remove undefined values to keep URL clean
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }

      const queryString = params.toString();
      const url = `/enrollments${queryString ? `?${queryString}` : ''}`;

      const response = await AxiosService.json.get(url);
      return response.data;
      
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get enrollment statistics
   */
  async getStats(): Promise<Record<string, any>> {
    try {
      const response = await AxiosService.json.get(
        '/enrollments/stats'
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get a single enrollment by ID
   */
  async getById(enrollmentId: string): Promise<Enrollment> {
    try {
      const response = await AxiosService.json.get(
        `/enrollments/${enrollmentId}`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Create a new enrollment
   */
  async create(data: EnrollmentCreate): Promise<Enrollment> {
    try {
      const response = await AxiosService.json.post(
        '/enrollments',
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Update enrollment progress or status
   */
  async update(
    enrollmentId: string,
    data: Partial<Enrollment>
  ): Promise<Enrollment> {
    try {
      const response = await AxiosService.json.patch(
        `/enrollments/${enrollmentId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Delete an enrollment (unenroll a student)
   */
  async delete(enrollmentId: string): Promise<void> {
    try {
      await AxiosService.json.delete(
        `/enrollments/${enrollmentId}`
      );
    } catch (error) {
      throw handleError(error);
    }
  },
};

