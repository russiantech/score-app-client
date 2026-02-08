/* =====================================================
   MODULE SERVICE
   Pattern-aligned with LessonService
===================================================== */

import { AxiosService } from '@/services/base/AxiosService';
import type { Course } from '@/types/course';
import type { ModuleCreate, Module, ModuleUpdate } from '@/types/course/module';
import { handleError } from '@/utils/helpers';

export const ModuleService = {
  /**
   * Create a new module for a course
   */
  async create(data: ModuleCreate): Promise<Module> {
    try {
      const response = await AxiosService.json.post('/modules', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get all modules for a specific course
   */
//   async getByCourse(
//     courseId: string,
//     includeRelations = false
//   ): Promise<Module[]> {
//     try {
//       const response = await AxiosService.json.get(
//         `/modules/course/${courseId}`,
//         {
//           params: { include_relations: includeRelations },
//         }
//       );
//       return response.data.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

  async getByCourse(
        courseId: string,
        options?: { include_relations?: boolean }
        ): Promise<{
        course: Course;
        modules: Module[];
        }> {
        try {
            const response = await AxiosService.json.get(
            `/modules/course/${courseId}`,
            {
                params: {
                include_relations: options?.include_relations ?? false,
                },
            }
            );

            return response.data.data;
        } catch (error) {
            throw handleError(error);
        }
        },

  /**
   * Get a single module by ID
   */
  async getById(
    moduleId: string,
    includeRelations = false
  ): Promise<Module> {
    try {
      const response = await AxiosService.json.get(
        `/modules/${moduleId}`,
        {
          params: { include_relations: includeRelations },
        }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Update a module
   */
  async update(
    moduleId: string,
    data: ModuleUpdate
  ): Promise<Module> {
    try {
      const response = await AxiosService.json.put(
        `/modules/${moduleId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Delete a module
   */
  async delete(moduleId: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/modules/${moduleId}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Reorder modules within a course
   */
  async reorder(
    courseId: string,
    moduleOrders: { id: string; order: number }[]
  ): Promise<Module[]> {
    try {
      const response = await AxiosService.json.post(
        `/modules/course/${courseId}/reorder`,
        { modules: moduleOrders }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Search modules within a course
   */
  async search(
    courseId: string,
    query: string
  ): Promise<Module[]> {
    try {
      const response = await AxiosService.json.get(
        `/modules/course/${courseId}/search`,
        {
          params: { q: query },
        }
      );
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
