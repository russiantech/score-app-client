
// src/types/index.ts - Complete Type Definitions

/* =====================================================
   BASE & COMMON TYPES
===================================================== */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  page_meta: {
    total_items_count: number
    current_page_number: number
    total_pages_count: number
    has_next_page: boolean
    has_prev_page: boolean
  }
  courses: T[]
}


export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FilterBadgeProps {
  children: React.ReactNode;
  onRemove: () => void;
  icon?: string;
  color?: string;
}
