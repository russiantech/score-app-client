// /* =====================================================
//    USER SERVICE
// ===================================================== */

// import { handleError } from "@/utils/helpers";
// import { AxiosService } from "@/services/base/AxiosService";
// import type { UserFilters, CreateUserDTO, UpdateUserDTO, User } from "@/types/users";

// export const UserService = {
  
//   async getAll(params?: UserFilters): Promise<{ data?: { users: User[] } } | User[]> {
//     try {
//       const response = await AxiosService.json.get('/users', { params: params });
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getById(id: string): Promise<User> {
//     try {
//       const response = await AxiosService.json.get(`/users/${id}`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async create(data: CreateUserDTO): Promise<User> {
//     try {
//       const response = await AxiosService.json.post('/users', data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async update(id: string, data: UpdateUserDTO): Promise<User> {
//     try {
//       const response = await AxiosService.json.put(`/users/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async update_partial(id: string, data: UpdateUserDTO): Promise<User> {
//     try {
//       const response = await AxiosService.json.patch(`/users/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async delete(id: string): Promise<void> {
//     try {
//       await AxiosService.json.delete(`/users/${id}`);
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async toggleStatus(id: string): Promise<User> {
//     try {
//       const response = await AxiosService.json.patch(`/users/${id}/toggle-status`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getParents(): Promise<User[]> {
//     try {
//       const response = await AxiosService.json.get('/users', { 
//         params: { role: 'parent' } 
//       });
//       return response.data.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getTutors(): Promise<User[]> {
//     try {
//       const response = await AxiosService.json.get('/users', { 
//         params: { role: 'tutor' } 
//       });
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },
  
// };




// // v2
// /* =====================================================
//    USER SERVICE
// ===================================================== */

// import { handleError } from "@/utils/helpers";
// import { AxiosService } from "@/services/base/AxiosService";
// import type { UserFilters, CreateUserDTO, UpdateUserDTO, User } from "@/types/users";

// export const UserService = {

//   async getAll(params?: UserFilters): Promise<{ data?: { users: User[] } } | User[]> {
//     try {
//       const response = await AxiosService.json.get('/users', { params });
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getById(id: string): Promise<User> {
//     try {
//       const response = await AxiosService.json.get(`/users/${id}`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async create(data: CreateUserDTO): Promise<User> {
//     try {
//       const response = await AxiosService.json.post('/users', data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async update(id: string, data: UpdateUserDTO): Promise<User> {
//     try {
//       const response = await AxiosService.json.put(`/users/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async update_partial(id: string, data: UpdateUserDTO): Promise<User> {
//     try {
//       const response = await AxiosService.json.patch(`/users/${id}`, data);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Upload a profile picture first, then patch the user's profile_picture field.
//    * Use this when saving a full profile form that may include an avatar change.
//    *
//    * Flow:
//    *   1. Upload image → get back URL
//    *   2. PATCH /users/:id with { ...data, profile_picture: url }
//    */
//   async updateWithAvatar(
//     id: string,
//     data: UpdateUserDTO,
//     avatarFile: File
//   ): Promise<User> {
//     try {
//       const { url } = await UserService.uploadAvatar(avatarFile);
//       return await UserService.update_partial(id, { ...data, profile_picture: url });
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   /**
//    * Upload an avatar image to /uploads/image.
//    * Returns the stored URL so it can be saved on the user record.
//    */
//   async uploadAvatar(file: File): Promise<{ url: string }> {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await AxiosService.multipart.post('/uploads/image', formData);

//       // Backend wraps response: { success, message, data: { url, ... } }
//       const data = response.data?.data ?? response.data;

//       if (!data?.url) {
//         throw new Error("Upload response missing URL");
//       }

//       return { url: data.url };
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async delete(id: string): Promise<void> {
//     try {
//       await AxiosService.json.delete(`/users/${id}`);
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async toggleStatus(id: string): Promise<User> {
//     try {
//       const response = await AxiosService.json.patch(`/users/${id}/toggle-status`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getParents(): Promise<User[]> {
//     try {
//       const response = await AxiosService.json.get('/users', {
//         params: { role: 'parent' },
//       });
//       return response.data.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async getTutors(): Promise<User[]> {
//     try {
//       const response = await AxiosService.json.get('/users', {
//         params: { role: 'tutor' },
//       });
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   // ── Role helpers ────────────────────────────────────────────────────────────

//   async assignRole(userId: string, role: string): Promise<User> {
//     try {
//       const response = await AxiosService.json.post(`/users/${userId}/roles`, { role });
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async removeRole(userId: string, role: string): Promise<User> {
//     try {
//       const response = await AxiosService.json.delete(`/users/${userId}/roles/${role}`);
//       return response.data;
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   // ── Parent ↔ Student linking ─────────────────────────────────────────────

//   async linkParent(parentId: string, studentId: string, relationshipType = "guardian", isPrimary = false): Promise<void> {
//     try {
//       await AxiosService.json.post('/users/link-parent', {
//         parent_id: parentId,
//         student_id: studentId,
//         relationship_type: relationshipType,
//         is_primary: isPrimary,
//       });
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

//   async unlinkParent(parentId: string, studentId: string, reason?: string): Promise<void> {
//     try {
//       await AxiosService.json.post('/users/unlink-parent', {
//         parent_id: parentId,
//         student_id: studentId,
//         reason,
//       });
//     } catch (error) {
//       throw handleError(error);
//     }
//   },

// };



// v3
/* =====================================================
   USER SERVICE
   FILE: src/services/users/UserService.ts
===================================================== */

import { handleError } from "@/utils/helpers";
import { AxiosService } from "@/services/base/AxiosService";
import type { UserFilters, CreateUserDTO, UpdateUserDTO, User } from "@/types/users";

export const UserService = {

  // ── List / Fetch ──────────────────────────────────────────────────────────

  async getAll(params?: UserFilters): Promise<{ data?: { users: User[] } } | User[]> {
    try {
      const response = await AxiosService.json.get('/users', { params });
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

  // ── Create ────────────────────────────────────────────────────────────────

  async create(data: CreateUserDTO): Promise<User> {
    try {
      const response = await AxiosService.json.post('/users', data);
      return response.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Update (text fields) ──────────────────────────────────────────────────

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      const response = await AxiosService.json.put(`/users/${id}`, data);
      return response.data.data;          // unwrap api_response wrapper
    } catch (error) {
      throw handleError(error);
    }
  },

  async update_partial(id: string, data: UpdateUserDTO): Promise<User> {
    try {
      const response = await AxiosService.json.patch(`/users/${id}`, data);
      return response.data.data;          // unwrap api_response wrapper
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Avatar upload — PATCH /users/:id/avatar (multipart) ──────────────────
  //
  // Lives on the user resource, NOT /uploads.
  // Returns the full updated User so auth state can be synced immediately.

  async uploadAvatar(userId: string, file: File): Promise<User> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await AxiosService.multipart.patch(
        `/users/${userId}/avatar`,
        formData,
      );

      return response.data.data;          // unwrap api_response wrapper
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Delete ────────────────────────────────────────────────────────────────

  async delete(id: string): Promise<void> {
    try {
      await AxiosService.json.delete(`/users/${id}`);
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Status ────────────────────────────────────────────────────────────────

  async toggleStatus(id: string): Promise<User> {
    try {
      const response = await AxiosService.json.patch(`/users/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Filtered lists ────────────────────────────────────────────────────────

  async getParents(): Promise<User[]> {
    try {
      const response = await AxiosService.json.get('/users', {
        params: { role: 'parent' },
      });
      return response.data.data?.users ?? response.data.data ?? [];
    } catch (error) {
      throw handleError(error);
    }
  },

  async getTutors(): Promise<User[]> {
    try {
      const response = await AxiosService.json.get('/users', {
        params: { role: 'tutor' },
      });
      return response.data.data?.users ?? response.data.data ?? [];
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Roles ─────────────────────────────────────────────────────────────────

  async assignRole(userId: string, role: string): Promise<User> {
    try {
      const response = await AxiosService.json.post(`/users/${userId}/roles`, { role_name: role });
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  async removeRole(userId: string, role: string): Promise<User> {
    try {
      const response = await AxiosService.json.delete(`/users/${userId}/roles/${role}`);
      return response.data.data;
    } catch (error) {
      throw handleError(error);
    }
  },

  // ── Parent ↔ Student ──────────────────────────────────────────────────────

  async linkParent(
    parentId: string,
    studentId: string,
    relationshipType = "guardian",
    isPrimary = false,
  ): Promise<void> {
    try {
      await AxiosService.json.post('/users/link-parent', {
        parent_id: parentId,
        student_id: studentId,
        relationship_type: relationshipType,
        is_primary: isPrimary,
      });
    } catch (error) {
      throw handleError(error);
    }
  },

  async unlinkParent(parentId: string, studentId: string, reason?: string): Promise<void> {
    try {
      await AxiosService.json.post('/users/unlink-parent', {
        parent_id: parentId,
        student_id: studentId,
        reason,
      });
    } catch (error) {
      throw handleError(error);
    }
  },

};
