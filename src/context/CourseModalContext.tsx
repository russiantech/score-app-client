// ============================================================================
// CONTEXT: CourseModalContext.tsx
// Global Course Modal Management
// ============================================================================

import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { Course, CourseModalContextType } from '@/types/course';

const CourseModalContext = createContext<CourseModalContextType | undefined>(undefined);

export const CourseModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openCreateModal = () => {
    setEditingCourse(null);
    setIsOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditingCourse(null);
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <CourseModalContext.Provider
      value={{
        isOpen,
        editingCourse,
        openCreateModal,
        openEditModal,
        closeModal,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </CourseModalContext.Provider>
  );
};

export const useCourseModal = () => {
  const context = useContext(CourseModalContext);
  if (!context) {
    throw new Error('useCourseModal must be used within CourseModalProvider');
  }
  return context;
};
