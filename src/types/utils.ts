/* =====================================================
  UTILITY TYPES
===================================================== */

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string | number;
  count?: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ValidationError {
  field: string;
  message: string;
}


export interface SplashScreenProps {
  onComplete: () => void;
}


export interface FilterBadgeProps {
  children: React.ReactNode;
  onRemove: () => void;
  icon?: string;
  color?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
