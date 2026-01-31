export interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline-secondary' | 'outline-danger' | 'outline-primary' | 'outline-warning' | 'light';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  children: React.ReactNode;
  className?: string;
  block?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
