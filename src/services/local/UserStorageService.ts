// services/local/UsersService.ts

import type { AuthPayload } from '@/types/auth';

const STORAGE_KEY = 'auth';

export const UserStorageService = {

  getCurrentUser: (): AuthPayload | null => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as AuthPayload;
    } catch {
      return null;
    }
  },

  authenticate: (payload: AuthPayload): void => {
    /* Emit events from UsersService during authentication */
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event(`${STORAGE_KEY}:updated`));
  },
  

  updateUser: (user: Partial<AuthPayload['user']>): void => {
    const current = UserStorageService.getCurrentUser();
    if (!current) return;

    const updated = {
      ...current,
      user: { ...current.user, ...user },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // updateUser: (data: Partial<AuthPayload['user']>): { success: boolean; data: User } => {
  //   const currentUser = UsersService.getCurrentUser();
  //   if (!currentUser) return { success: false, data: null as any };

  //   const updatedUser = { ...currentUser, ...data };
  //   UsersService.authenticate(updatedUser);

  //   return { success: true, data: updatedUser };
  // },


  signout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(`${STORAGE_KEY}:signout`));
  },
};

