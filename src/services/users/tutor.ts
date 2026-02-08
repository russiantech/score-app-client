/* =====================================================
   TUTOR ASSIGNMENT SERVICE
===================================================== */

// import type { Course } from "@/types/course";
// import type {
//   CreateTutorAssignmentDTO,
//   TutorAssignment,
// } from "@/types/tutor";

// import { AxiosService } from "@/services/base/AxiosService";
// import { handleError } from "@/utils/helpers";

/* =====================================================
   STATIC FALLBACK DATA
   Used only when API calls fail (intentional design)
===================================================== */

// const DEFAULT_TUTOR_COURSES: readonly Course[] = [
//   {
//     id: "1",
//     title: "Advanced Python Programming",
//     code: "CS301",
//     enrolled: 15,
//     lessons: 8,
//     assessments: 12,
//     status: "active",
//     department: "Computer Science",
//     credits: 3,
//     semester: "Fall 2024",
//     tutorEmail: "tutor1@example.com",
//     tutorId: "tutor1",
//     enrolledStudents: [],
//     createdAt: "2024-08-01T00:00:00Z",
//     updatedAt: "2024-08-01T00:00:00Z",
//     description: "A course on advanced Python concepts.",
//     startDate: "2024-09-01",
//     endDate: "2024-12-15",
//     room: "Room 101",
//   },
//   {
//     id: "2",
//     title: "Web Development Fundamentals",
//     code: "WEB101",
//     enrolled: 22,
//     lessons: 10,
//     assessments: 15,
//     status: "active",
//     department: "Web Technologies",
//     credits: 4,
//     semester: "Spring 2024",
//     tutorEmail: "tutor2@example.com",
//     tutorId: "tutor2",
//     enrolledStudents: [],
//     createdAt: "2023-12-01T00:00:00Z",
//     updatedAt: "2023-12-01T00:00:00Z",
//     description: "Introduction to web development.",
//     startDate: "2024-01-10",
//     endDate: "2024-05-01",
//     room: "Room 202",
//   },
//   {
//     id: "3",
//     title: "Data Science Basics",
//     code: "DS201",
//     enrolled: 18,
//     lessons: 6,
//     assessments: 9,
//     status: "active",
//     department: "Data Science",
//     credits: 3,
//     semester: "Summer 2024",
//     tutorEmail: "tutor3@example.com",
//     tutorId: "tutor3",
//     enrolledStudents: [],
//     createdAt: "2024-05-01T00:00:00Z",
//     updatedAt: "2024-05-01T00:00:00Z",
//     description: "Basics of data science and analytics.",
//     startDate: "2024-06-01",
//     endDate: "2024-08-15",
//     room: "Room 303",
//   },
// ];




// v2

// /* =====================================================
//    STATIC FALLBACK DATA (TYPE-SAFE)
// ===================================================== */

// export const DEFAULT_TUTOR_COURSES: readonly Course[] = [
//   {
//     id: "1",
//     title: "Advanced Python Programming",
//     description: "A course on advanced Python concepts.",
//     code: "CS301",

//     department: "Computer Science",
//     credits: 3,
//     semester: "Fall 2024",

//     tutorId: "tutor1",
//     tutorEmail: "tutor1@example.com",

//     lessons: [],
//     enrolledStudents: [],

//     status: "active",

//     createdAt: "2024-08-01T00:00:00Z",
//     updatedAt: "2024-08-01T00:00:00Z",
//   },
//   {
//     id: "2",
//     title: "Web Development Fundamentals",
//     description: "Introduction to web development.",
//     code: "WEB101",

//     department: "Web Technologies",
//     credits: 4,
//     semester: "Spring 2024",

//     tutorId: "tutor2",
//     tutorEmail: "tutor2@example.com",

//     lessons: [],
//     enrolledStudents: [],

//     status: "active",

//     createdAt: "2023-12-01T00:00:00Z",
//     updatedAt: "2023-12-01T00:00:00Z",
//   },
//   {
//     id: "3",
//     title: "Data Science Basics",
//     description: "Basics of data science and analytics.",
//     code: "DS201",

//     department: "Data Science",
//     credits: 3,
//     semester: "Summer 2024",

//     tutorId: "tutor3",
//     tutorEmail: "tutor3@example.com",

//     lessons: [],
//     enrolledStudents: [],

//     status: "active",

//     createdAt: "2024-05-01T00:00:00Z",
//     updatedAt: "2024-05-01T00:00:00Z",
//   },
// ];

// /* =====================================================
//    SERVICE
// ===================================================== */

// export const TutorService = {
//   async assign(
//     data: CreateTutorAssignmentDTO
//   ): Promise<TutorAssignment> {
//     try {
//       const response = await AxiosService.json.post(
//         "/tutors",
//         data
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async unassign(id: string): Promise<void> {
//     try {
//       await AxiosService.json.delete(
//         `/tutors/${id}`
//       );
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async coursesByTutor(username: string): Promise<Course[]> {
//     try {
//       const response = await AxiosService.json.get(
//         `/tutors/${username}/courses`
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Returns courses assigned to the currently authenticated tutor.
//    * Falls back to static data if the API fails.
//    */
//   async myCourses(): Promise<Course[]> {
//     try {
//       const response = await AxiosService.json.get(
//         "/tutor/courses"
//       );
//       return response.data;
//     } catch (error) {
//       console.warn(
//         "Failed to load tutor courses. Falling back to default data.",
//         error
//       );
//       return [...DEFAULT_TUTOR_COURSES];
//     }
//   },

//   async tutorByCourse(
//     courseId: string
//   ): Promise<TutorAssignment[]> {
//     try {
//       const response = await AxiosService.json.get(
//         `/courses/${courseId}/assignments`
//       );
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },
// };


// v3
/* =====================================================
   TUTOR SERVICE
===================================================== */

// import type { User } from "@/types/auth";
// import { AxiosService } from "../base/AxiosService";
// // import { AxiosService } from "@/services/base/AxiosService";
// // import { handleError } from "@/utils/helpers";

// const DEFAULT_TUTORS: User[] = [
//   {
//     id: "t1",
//     names: "Engr. Chris",
//     email: "chris@academy.com",
//     roles: ["tutor"],
//     is_active: true,
//     is_verified: true,
//     created_at: "",
//     updated_at: "",
//     isActive: undefined,
//     department: undefined,
//     qualifications: undefined
//   },
//   {
//     id: "t2",
//     names: "Dr. Sarah Williams",
//     email: "sarah@academy.com",
//     roles: ["tutor"],
//     is_active: true,
//     is_verified: true,
//     created_at: "",
//     updated_at: "",
//     isActive: undefined,
//     department: undefined,
//     qualifications: undefined
//   },
// ];

// export const TutorService = {
//   async list(): Promise<User[]> {
//     try {
//       const response = await AxiosService.json.get("/users?tutor=true");
//       return response.data;
//     } catch (error) {
//       console.warn("Failed to load tutors, using defaults.", error);
//       return DEFAULT_TUTORS;
//     }
//   },
// };



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
