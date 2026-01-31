import type { ApiResponse, Student, Parent, Tutor } from '../../types';
import type { User } from '../../types/auth';
import { AxiosService } from '../base/AxiosService';
// import { ApiResponse, User, Student, Parent, Tutor } from '../../types';

const UserService = {
  // Profile Management
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await AxiosService.json.get('/users');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await AxiosService.json.put('/users', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await AxiosService.json.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Admin: User Management
  async getAllUsers(params?: any): Promise<ApiResponse<any>> {
    const response = await AxiosService.fetchPage('/admin/users', params);
    return response.data;
  },

  async createUser(userData: any): Promise<ApiResponse> {
    const response = await AxiosService.json.post('/admin/users', userData);
    return response.data;
  },

  async updateUser(userId: string, data: any): Promise<ApiResponse> {
    const response = await AxiosService.json.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: string): Promise<ApiResponse> {
    const response = await AxiosService.json.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Students
  async getStudents(params?: any): Promise<ApiResponse<any>> {
    const response = await AxiosService.fetchPage('/students', params);
    return response.data;
  },

  async getStudentById(studentId: string): Promise<ApiResponse<Student>> {
    const response = await AxiosService.json.get(`/students/${studentId}`);
    return response.data;
  },

  // Parents
  async getParents(params?: any): Promise<ApiResponse<any>> {
    const response = await AxiosService.fetchPage('/parents', params);
    return response.data;
  },

  async getParentById(parentId: string): Promise<ApiResponse<Parent>> {
    const response = await AxiosService.json.get(`/parents/${parentId}`);
    return response.data;
  },

  async linkChildToParent(parentId: string, studentId: string): Promise<ApiResponse> {
    const response = await AxiosService.json.post(`/parents/${parentId}/children`, {
      studentId,
    });
    return response.data;
  },

  // Tutors
  async getTutors(params?: any): Promise<ApiResponse<any>> {
    const response = await AxiosService.fetchPage('/tutors', params);
    return response.data;
  },

  async getTutorById(tutorId: string): Promise<ApiResponse<Tutor>> {
    const response = await AxiosService.json.get(`/tutors/${tutorId}`);
    return response.data;
  },
};

export default UserService;