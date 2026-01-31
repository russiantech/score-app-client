/* =====================================================
   PARENT-CHILD SERVICE
===================================================== */

import type { User } from "@/types/auth";
import type { ParentChild, CreateParentChildDTO, ChildInfo } from "@/types/parent";
import { handleError } from "@/utils/helpers";
import { AxiosService } from "@/services/base/AxiosService";

export const ParentChildService = {
  async getAll(): Promise<ParentChild[]> {
    try {
      const response = await AxiosService.json.get('/parent-child');
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async create(data: CreateParentChildDTO): Promise<ParentChild> {
    try {
      const response = await AxiosService.json.post('/parent-child', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/parent-child/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  async getChildren(parentId: string): Promise<ChildInfo[]> {
    try {
      const response = await AxiosService.json.get(`/parents/${parentId}/children`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getParents(childId: string): Promise<User[]> {
    try {
      const response = await AxiosService.json.get(`/students/${childId}/parents`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
};
