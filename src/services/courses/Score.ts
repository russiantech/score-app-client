// /* =====================================================
//    SCORE SERVICE
// ===================================================== */

// import type { ScoreFilter, Score, CreateScoreDTO, UpdateScoreDTO } from "@/types/course/score";
// import { handleError } from "@/utils/helpers";
// import { AxiosService } from "../base/AxiosService";

// export const ScoreService = {
  
//   async getAll(filter?: ScoreFilter): Promise<Score[]> {
//     try {
//       const response = await AxiosService.json.get('/scores', { params: filter });
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getById(id: string): Promise<Score> {
//     try {
//       const response = await AxiosService.json.get(`/scores/${id}`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async create(data: CreateScoreDTO): Promise<Score> {
//     try {
//       const response = await AxiosService.json.post('/scores', data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async update(id: string, data: UpdateScoreDTO): Promise<Score> {
//     try {
//       const response = await AxiosService.json.put(`/scores/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   // async bulkCreate(data: BulkScoreCreateDTO): Promise<Score[]> {
//   //   try {
//   //     const response = await AxiosService.json.post(
//   //       `/assessments/${data.assessmentId}/scores/bulk`,
//   //       { scores: data.scores }
//   //     );
//   //     return response.data;
//   //   } catch (error) {
//   //     throw handleError(error);
//   //   }
//   // },

//   // v2
//   /**
//    * Get scores for a lesson with all enrolled students
//    */
//   async getByLesson(lessonId: string): Promise<LessonScoreResponse> {
//     const response = await AxiosService.json.get(
//       `/scores/${lessonId}/lesson/with-students`
//     );
//     return response.data;
//   },

//   /**
//    * Create or update score records in bulk
//    */
//   async bulkCreate(data: BulkScoreRequest) {
//     const response = await AxiosService.json.post('/scores/bulk', data);
//     return response.data;
//   },

//   async delete(id: string): Promise<void> {
//     try {
//       await AxiosService.json.delete(`/scores/${id}`);
//     } catch (error) {
//       throw handleError(error);
//     }
//   },
// };



// v2

// // src/services/courses/Score.ts
// import type { ScoreBulkCreate, ScoreResponse } from '@/types/course/score';
// import { AxiosService as api } from '../base/AxiosService';
// import { handleError } from '@/utils/helpers';

// export type { StudentScoreData } from '@/types/score';

// export class ScoreService {
//   /**
//    * Get scores for a lesson with all enrolled students
//    * Backend validates enrollment automatically
//    */
//   static async getByLesson(
//     lessonId: string,
//     page: number = 1,
//     pageSize: number = 100
//   ): Promise<ScoreResponse> {
//     const response = await api.json.get(`/scores/${lessonId}/lesson`, {
//       params: { page, page_size: pageSize }
//     });
//     return response.data.data;
//   }

//   /**
//    * Get scores for a module (exams) with all enrolled students
//    */
//   static async getByModule(
//     moduleId: string,
//     page: number = 1,
//     pageSize: number = 100
//   ): Promise<ScoreResponse> {
//     const response = await api.json.get(`/scores/${moduleId}/module`, {
//       params: { page, page_size: pageSize }
//     });
//     return response.data.data;
//   }

//   /**
//    * Get scores for a course (projects) with all enrolled students
//    */
//   static async getByCourse(
//     courseId: string,
//     page: number = 1,
//     pageSize: number = 100
//   ): Promise<ScoreResponse> {
//     const response = await api.json.get(`/scores/${courseId}/course`, {
//       params: { page, page_size: pageSize }
//     });
//     return response.data.data;
//   }

//   /**
//    * Bulk create/update scores
//    * Backend validates that students are enrolled before saving
//    * Supports lesson (assessment/assignment), module (exam), or course (project) level
//    */
//   static async bulkCreate(data: ScoreBulkCreate): Promise<{
//     created: number;
//     updated: number;
//   }> {
//     const response = await api.json.post('/scores/bulk', data);
//     return response.data.data;
//   }

//   /**
//    * Get score statistics
//    */
//   static async getStats(
//     id: string, 
//     type: 'lesson' | 'module' | 'course'
//   ): Promise<{
//     total: number;
//     average_score: number;
//     highest_score: number;
//     lowest_score: number;
//     pass_rate: number;
//   }> {
//     const response = await api.json.get(`/scores/${id}/${type}/stats`);
//     return response.data.data;
//   }
// }

// export default ScoreService;


// // v4 - Flexible score service
// // src/services/courses/Score.ts

// import { AxiosService as api } from '../base/AxiosService';
// import type {
//   LessonScoreResponse,
//   BulkScoreRequest,
//   ScoreColumnCreate,
//   ScoreColumnUpdate,
//   ScoreColumn
// } from '@/types/course/score';

// export const ScoreService = {
//   /**
//    * Get scores for a lesson with all enrolled students
//    * Includes flexible column configuration
//    */
//   async getByLesson(lessonId: string): Promise<LessonScoreResponse> {
//     const response = await api.json.get(
//       `/scores/${lessonId}/lesson`
//     );
//     return response.data;
//   },

//   /**
//    * Create or update score records in bulk with column configuration
//    */
//   async bulkCreate(data: BulkScoreRequest) {
//     const response = await api.json.post('/scores/bulk', data);
//     return response.data;
//   },

//   /**
//    * Create a new score column
//    */
//   async createColumn(data: ScoreColumnCreate): Promise<ScoreColumn> {
//     const response = await api.json.post('/scores/columns', data);
//     return response.data;
//   },

//   /**
//    * Update an existing score column
//    */
//   async updateColumn(columnId: string, data: ScoreColumnUpdate): Promise<ScoreColumn> {
//     const response = await api.json.put(`/scores/columns/${columnId}`, data);
//     return response.data;
//   },

//   /**
//    * Delete a score column
//    */
//   async deleteColumn(columnId: string) {
//     const response = await api.json.delete(`/scores/columns/${columnId}`);
//     return response.data;
//   }
// };

// export default ScoreService;





// // v4 - Flexible score service
// // src/services/courses/Score.ts

// import { AxiosService as apiClient } from '../base/AxiosService';
// import type {
//   LessonScoreResponse,
//   BulkScoreRequest,
//   ScoreColumnCreate,
//   ScoreColumnUpdate,
//   ScoreColumn,
//   BulkScoreCreateRequest
// } from '@/types/course/score';

// export const ScoreService = {
//   /**
//    * Get scores for a lesson with all enrolled students
//    * Includes flexible column configuration
//    */
//   async getByLesson(lessonId: string): Promise<LessonScoreResponse> {
//     const response = await apiClient.json.get(
//       `/scores/${lessonId}/lesson`
//       // `/scores/${lessonId}/lesson/with-students`
//     );
//     return response.data.data;
//   },

//   /**
//    * Create or update score records in bulk with column configuration
//    */
//   // async bulkCreate(data: BulkScoreRequest) {
//   //   const response = await apiClient.json.post('/scores/bulk', data);
//   //   return response.data;
//   // },

//   async bulkCreate(data: BulkScoreCreateRequest): Promise<any> {
//     try {
//       const response = await apiClient.json.post('/scores/bulk', data);
//       return response.data;
//     } catch (error) {
//       console.error('Score bulk create error:', error);
//       throw error;
//     }
//   },

//   /**
//    * Create a new score column
//    */
//   async createColumn(data: ScoreColumnCreate): Promise<ScoreColumn> {
//     const response = await apiClient.json.post('/scores/columns', data);
//     return response.data;
//   },

//   /**
//    * Update an existing score column
//    */
//   async updateColumn(columnId: string, data: ScoreColumnUpdate): Promise<ScoreColumn> {
//     const response = await apiClient.json.put(`/scores/columns/${columnId}`, data);
//     return response.data;
//   },

//   /**
//    * Delete a score column
//    */
//   async deleteColumn(columnId: string) {
//     const response = await apiClient.json.delete(`/scores/columns/${columnId}`);
//     return response.data;
//   }
// };

// export default ScoreService;



// // v4
// // src/services/courses/Score.ts
// // Complete Score service with proper error handling

// import { AxiosService as apiClient } from '../base/AxiosService';
// import type {
//   LessonScoreResponse,
//   BulkScoreRequest,
//   ScoreColumnCreate,
//   ScoreColumnUpdate,
//   ScoreColumn
// } from '@/types/course/score';

// export const ScoreService = {
//   /**
//    * Get scores for a lesson with all enrolled students
//    * Includes flexible column configuration
//    */
//   async getByLesson(lessonId: string): Promise<LessonScoreResponse> {
//     try {
//       const response = await apiClient.json.get(`/scores/${lessonId}/lesson`);
      
//       // Handle different response structures
//       if (response.data?.data) {
//         return response.data.data;
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Failed to fetch lesson scores:', error);
//       throw error;
//     }
//   },

//   /**
//    * Create or update score records in bulk with column configuration
//    */
//   async bulkCreate(data: BulkScoreRequest): Promise<{
//     lesson_id: string;
//     created: number;
//     updated: number;
//     total_processed: number;
//     columns_configured: number;
//     errors?: string[];
//   }> {
//     try {
//       console.log('Sending bulk create request:', JSON.stringify(data, null, 2));
      
//       const response = await apiClient.json.post('/scores/bulk', data);
      
//       // Handle different response structures
//       if (response.data?.data) {
//         return response.data.data;
//       }
//       return response.data;
//     } catch (error: any) {
//       console.error('Bulk create error:', error);
      
//       // Log detailed error information
//       if (error.response) {
//         console.error('Error response:', error.response.data);
//         console.error('Error status:', error.response.status);
//       }
      
//       throw error;
//     }
//   },

//   /**
//    * Create a new score column
//    */
//   async createColumn(data: ScoreColumnCreate): Promise<ScoreColumn> {
//     try {
//       const response = await apiClient.json.post('/scores/columns', data);
      
//       if (response.data?.data) {
//         return response.data.data;
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create column:', error);
//       throw error;
//     }
//   },

//   /**
//    * Update an existing score column
//    */
//   async updateColumn(columnId: string, data: ScoreColumnUpdate): Promise<ScoreColumn> {
//     try {
//       const response = await apiClient.json.put(`/scores/columns/${columnId}`, data);
      
//       if (response.data?.data) {
//         return response.data.data;
//       }
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update column:', error);
//       throw error;
//     }
//   },

//   /**
//    * Delete a score column
//    */
//   async deleteColumn(columnId: string): Promise<void> {
//     try {
//       await apiClient.json.delete(`/scores/columns/${columnId}`);
//     } catch (error) {
//       console.error('Failed to delete column:', error);
//       throw error;
//     }
//   }
// };

// export default ScoreService;



// v5 - with services for modules(exams) and courses(projects)
// src/services/courses/Score.ts
// Complete Score service with Lesson, Module, and Course support

import { AxiosService as apiClient } from '../base/AxiosService';
import type {
  LessonScoreResponse,
  ScoreColumnCreate,
  ScoreColumnUpdate,
  ScoreColumn
} from '@/types/course/score';

export const ScoreService = {
  // ============================================================================
  // LESSON LEVEL (Homework, Classwork, Quiz)
  // ============================================================================
  
  /**
   * Get scores for a lesson with all enrolled students
   */
  async getByLesson(lessonId: string): Promise<LessonScoreResponse> {
    try {
      const response = await apiClient.json.get(`/scores/${lessonId}/lesson`);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch lesson scores:', error);
      throw error;
    }
  },

  /**
   * Create or update lesson scores in bulk
   */
  async bulkCreate(data: any): Promise<{
    lesson_id: string;
    created: number;
    updated: number;
    total_processed: number;
    columns_configured: number;
    errors?: string[];
  }> {
    try {
      const response = await apiClient.json.post('/scores/bulk', data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error: any) {
      console.error('Bulk create error:', error);
      throw error;
    }
  },

  // ============================================================================
  // MODULE LEVEL (Exams)
  // ============================================================================
  
  /**
   * Get module exam scores with all enrolled students
   */
  async getByModule(moduleId: string): Promise<any> {
    try {
      const response = await apiClient.json.get(`/scores/${moduleId}/module`);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch module scores:', error);
      throw error;
    }
  },

  /**
   * Create or update module exam scores
   */
  async bulkCreateModule(data: {
    module_id: string;
    columns: any[];
    scores: any[];
  }): Promise<any> {
    try {
      const response = await apiClient.json.post('/scores/module/bulk', data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Module bulk create error:', error);
      throw error;
    }
  },

  // ============================================================================
  // COURSE LEVEL (Projects)
  // ============================================================================
  
  /**
   * Get course project scores with all enrolled students
   */
  async getByCourse(courseId: string): Promise<any> {
    try {
      const response = await apiClient.json.get(`/scores/${courseId}/course`);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to fetch course scores:', error);
      throw error;
    }
  },

  /**
   * Create or update course project scores
   */
  async bulkCreateCourse(data: {
    course_id: string;
    columns: any[];
    scores: any[];
  }): Promise<any> {
    try {
      const response = await apiClient.json.post('/scores/course/bulk', data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Course bulk create error:', error);
      throw error;
    }
  },

  // ============================================================================
  // COLUMN MANAGEMENT (All Levels)
  // ============================================================================
  
  /**
   * Create a new score column
   */
  async createColumn(data: ScoreColumnCreate): Promise<ScoreColumn> {
    try {
      const response = await apiClient.json.post('/scores/columns', data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to create column:', error);
      throw error;
    }
  },

  /**
   * Update an existing score column
   */
  async updateColumn(columnId: string, data: ScoreColumnUpdate): Promise<ScoreColumn> {
    try {
      const response = await apiClient.json.put(`/scores/columns/${columnId}`, data);
      
      if (response.data?.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Failed to update column:', error);
      throw error;
    }
  },

  /**
   * Delete a score column
   */
  async deleteColumn(columnId: string): Promise<void> {
    try {
      await apiClient.json.delete(`/scores/columns/${columnId}`);
    } catch (error) {
      console.error('Failed to delete column:', error);
      throw error;
    }
  }
};

export default ScoreService;