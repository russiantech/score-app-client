
export interface FormSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  error?: string;
  colClass?: string;
}
