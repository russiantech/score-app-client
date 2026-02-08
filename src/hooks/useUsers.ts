// // =====================================================
// // src/hooks/useUsers.ts - Custom Hook for Users
// // =====================================================

// import { UserService } from "@/services/users/UserService";
// import type { User, UserFilters } from "@/types/users";
// import { useApi } from "./useApi";

// export function useUsers(filters?: UserFilters) {
//   return useApi<User[]>(
//     () => UserService.getAll(filters),
//     { immediate: true, initialData: [] }
//   );
// }

// export function useTutors() {
//   return useApi<User[]>(
//     () => UserService.getTutors(),
//     { immediate: true, initialData: [] }
//   );
// }

// export function useStudents() {
//   return useApi<User[]>(
//     () => UserService.getAll({ role: 'student' }),
//     { immediate: true, initialData: [] }
//   );
// }

// export function useParents() {
//   return useApi<User[]>(
//     () => UserService.getParents(),
//     { immediate: true, initialData: [] }
//   );
// }



// v2
// src/hooks/useUsers.ts
// Complete corrected version:

import { UserService } from "@/services/users/UserService";
import type { User, UserFilters } from "@/types/users";
import { useApi } from "./useApi";

// Type adapter function
async function getUsersAdapter(filters?: UserFilters): Promise<User[]> {
  const response = await UserService.getAll(filters);
  
  // Handle different response formats
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as any).data;
    if (data && typeof data === 'object' && 'users' in data) {
      return Array.isArray(data.users) ? data.users : [];
    }
    if (Array.isArray(data)) {
      return data;
    }
  }
  
  return [];
}

export function useUsers(filters?: UserFilters) {
  return useApi<User[]>(
    () => getUsersAdapter(filters),
    { immediate: true, initialData: [] }
  );
}

export function useTutors() {
  return useApi<User[]>(
    async () => {
      const response = await UserService.getTutors();
      return Array.isArray(response) ? response : [];
    },
    { immediate: true, initialData: [] }
  );
}

export function useStudents() {
  return useApi<User[]>(
    () => getUsersAdapter({ role: 'student' }),
    { immediate: true, initialData: [] }
  );
}

export function useParents() {
  return useApi<User[]>(
    async () => {
      const response = await UserService.getParents();
      return Array.isArray(response) ? response : [];
    },
    { immediate: true, initialData: [] }
  );
}
