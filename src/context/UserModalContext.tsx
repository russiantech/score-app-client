// ============================================================================
// CONTEXT: UserModalContext.tsx
// Global User Modal Management
// ============================================================================

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User } from '@/types/auth';
import type { UserModalContextType } from '@/types/users';

const UserModalContext = createContext<UserModalContextType | undefined>(undefined);

export const UserModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [defaultRole, setDefaultRole] = useState<string | null>(null);

  const openCreateModal = (role?: string) => {
    setEditingUser(null);
    setDefaultRole(role || 'student');
    setIsOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setDefaultRole(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingUser(null);
    setDefaultRole(null);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <UserModalContext.Provider
      value={{
        isOpen,
        editingUser,
        openCreateModal,
        openEditModal,
        closeModal,
        refreshTrigger,
        triggerRefresh,
        defaultRole,
      }}
    >
      {children}
    </UserModalContext.Provider>
  );
};

export const useUserModal = () => {
  const context = useContext(UserModalContext);
  if (!context) {
    throw new Error('useUserModal must be used within UserModalProvider');
  }
  return context;
};
