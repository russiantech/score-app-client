// =====================================================
//    SCORE SERVICE
// ===================================================== 

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