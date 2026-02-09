/* =====================================================
   USER SERVICE
===================================================== */

import { handleError } from "@/utils/helpers";
import { AxiosService } from "@/services/base/AxiosService";
import type { UserFilters, CreateUserDTO, UpdateUserDTO, User } from "@/types/users";

export const UserService = {
  
  async getAll(params?: UserFilters): Promise<{ data?: { users: User[] } } | User[]> {
    try {
      const response = await AxiosService.json.get('/users', { params: params });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getById(id: string): Promise<User> {
    try {
      const response = await AxiosService.json.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async create(data: CreateUserDTO): Promise<User> {
    try {
      const response = await AxiosService.json.post('/users', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      const response = await AxiosService.json.put(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async update_partial(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      const response = await AxiosService.json.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/users/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  async toggleStatus(id: string): Promise<User> {
    try {
      const response = await AxiosService.json.patch(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getParents(): Promise<User[]> {
    try {
      const response = await AxiosService.json.get('/users', { 
        params: { role: 'parent' } 
      });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async getTutors(): Promise<User[]> {
    try {
      const response = await AxiosService.json.get('/users', { 
        params: { role: 'tutor' } 
      });
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },
  
};

