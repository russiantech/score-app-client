// =====================================================
// src/hooks/useUsers.ts - Custom Hook for Users
// =====================================================

import { UserService } from "@/services/users/UserService";
import type { User } from "@/types/auth";
import { useApi } from "./useApi";

// import { UserService } from '../services';
// import type { User } from '@/types';
// import type { useApi } from './useApi';

export function useUsers(role?: string) {
  return useApi<User[]>(
    () => UserService.getAll(role),
    { immediate: true, initialData: [] }
  );
}

export function useTutors() {
  return useApi<User[]>(
    () => UserService.getTutors(),
    { immediate: true, initialData: [] }
  );
}

export function useStudents() {
  return useApi<User[]>(
    () => UserService.getStudents(),
    { immediate: true, initialData: [] }
  );
}

export function useParents() {
  return useApi<User[]>(
    () => UserService.getParents(),
    { immediate: true, initialData: [] }
  );
}

