// v4
/* =====================================================
   TUTOR ASSIGNMENT SERVICE
   Manages tutor-to-course assignments
===================================================== */

import { handleError } from '@/utils/helpers';
import { AxiosService } from '../base/AxiosService';
import type {
  TutorAssignment,
  TutorAssignmentCreate,
  TutorAssignmentFilters,
  TutorAssignmentStats,
} from '@/types/tutor';

export const TutorService = {
  /**
   * Get all tutor assignments with optional filters and pagination
   */
  async getAll(filters?: TutorAssignmentFilters): Promise<{
    data: {
      page_meta: {
        total: number;
        total_pages: number;
        current_page: number;
        page_size: number;
      };
      assignments: TutorAssignment[];
      meta: {
        total: number;
        total_pages: number;
        current_page: number;
        page_size: number;
      };
    };
  }> {
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
      const url = `/tutors${queryString ? `?${queryString}` : ''}`;

      const response = await AxiosService.json.get(url);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get tutor assignment statistics
   */
  async getStats(): Promise<{
    success: TutorAssignmentStats;
    data: TutorAssignmentStats;
  }> {
    try {
      const response = await AxiosService.json.get('/tutors/stats');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get a single tutor assignment by ID
   */
  async getById(assignmentId: string): Promise<{
    data: TutorAssignment;
  }> {
    try {
      const response = await AxiosService.json.get(
        `/tutors/${assignmentId}/assignment`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all assignments for a specific tutor
   */
  async getByTutorId(tutorId: string): Promise<{
    data: TutorAssignment[];
  }> {
    try {
      const response = await AxiosService.json.get(
        `/tutors/${tutorId}/assignments`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all assignments for a specific course
   */
  async getByCourseId(courseId: string): Promise<{
    data: TutorAssignment[];
  }> {
    try {
      const response = await AxiosService.json.get(
        `/courses/${courseId}/assignments`
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get courses assigned to the currently authenticated tutor
   */
  async getMyCourses(): Promise<{
    data: TutorAssignment[];
  }> {
    try {
      const response = await AxiosService.json.get('/tutors/my-courses');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Create a new tutor assignment
   */
  async create(data: TutorAssignmentCreate): Promise<{
    data: TutorAssignment;
  }> {
    try {
      const response = await AxiosService.json.post(
        '/tutors',
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Update a tutor assignment (e.g., change status)
   */
  async update(
    assignmentId: string,
    data: Partial<TutorAssignment>
  ): Promise<{
    data: TutorAssignment;
  }> {
    try {
      const response = await AxiosService.json.patch(
        `/tutors/${assignmentId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Delete a tutor assignment (unassign tutor from course)
   */
  async delete(assignmentId: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/tutors/${assignmentId}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Bulk assign multiple courses to a tutor
   */
  async bulkCreate(data: {
    tutor_id: string;
    course_ids: string[];
  }): Promise<{
    data: {
      created: TutorAssignment[];
      failed: Array<{ course_id: string; error: string }>;
    };
  }> {
    try {
      const response = await AxiosService.json.post(
        '/tutors/bulk',
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Bulk delete multiple assignments
   */
  async bulkDelete(assignmentIds: string[]): Promise<{
    data: {
      deleted: number;
      failed: Array<{ assignment_id: string; error: string }>;
    };
  }> {
    try {
      const response = await AxiosService.json.post(
        '/tutors/bulk-delete',
        { assignment_ids: assignmentIds }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Change the status of an assignment (activate/deactivate)
   */
  async updateStatus(
    assignmentId: string,
    status: 'active' | 'inactive' | 'revoked'
  ): Promise<{
    data: TutorAssignment;
  }> {
    try {
      const response = await AxiosService.json.patch(
        `/tutors/${assignmentId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Reassign a course from one tutor to another
   */
  async reassign(data: {
    assignment_id: string;
    new_tutor_id: string;
    reason?: string;
  }): Promise<{
    data: TutorAssignment;
  }> {
    try {
      const response = await AxiosService.json.post(
        '/tutors/reassign',
        data
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};

// export default TutorService;
