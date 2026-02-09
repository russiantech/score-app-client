
// src/types/buttons.ts

export interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  small?: boolean;
}


export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 
    | 'primary' 
    | 'secondary' 
    | 'danger' 
    | 'success'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'outline-primary'
    | 'outline-secondary' 
    | 'outline-danger'
    | 'outline-success'
    | 'outline-warning'
    | 'outline-info';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children?: React.ReactNode;
  className?: string;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
