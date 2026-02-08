// export const Button = ({ 
//   onClick, 
//   disabled = false, 
//   loading = false, 
//   variant = 'primary', 
//   size = 'sm', 
//   icon, 
//   children, 
//   className = '', 
//   type = 'button' 
// }) => {
//   const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';


  
//   return (
//     <button
//       type={type}
//       className={`btn btn-${variant} ${sizeClass} ${className}`}
//       onClick={onClick}
//       disabled={disabled || loading}
//     >
//       {loading ? (
//         <>
//           <span className="spinner-border spinner-border-sm me-2" role="status" />
//           {children}
//         </>
//       ) : (
//         <>
//           {icon && <i className={`${icon} me-2`} />}
//           {children}
//         </>
//       )}
//     </button>
//   );
// };


// src/components/buttons/Button.tsx (or create separate file)
// v2

import type { ButtonProps, EmptyStateProps } from "@/types/buttons";

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  small = false 
}) => (
  <div className={`text-center py-${small ? '4' : '5'}`}>
    <i className={`${icon} ${small ? 'fa-2x' : 'fa-3x'} text-muted mb-3`} />
    <h5 className={small ? 'h6' : ''}>{title}</h5>
    <p className={`text-muted ${small ? 'small' : ''} mb-3`}>{description}</p>
    {actionLabel && onAction && (
      <Button 
        variant="outline-primary" 
        size="md" 
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    )}
  </div>
);


export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'sm',
  icon,
  children,
  className = '',
  block = false,
  type = 'button'
}) => {

  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const blockClass = block ? 'w-100' : '';
  
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${blockClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" />
          {children}
        </>
      ) : (
        <>
          {icon && <i className={`${icon} me-2`} />}
          {children}
        </>
      )}
    </button>
  );
};
