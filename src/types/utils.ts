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
