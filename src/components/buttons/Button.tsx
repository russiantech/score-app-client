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

export const EmptyState = ({ icon, title, description, actionLabel, onAction }) => (
  <div className="text-center py-5">
    <i className={`${icon} fa-3x text-muted mb-3`} />
    <h5>{title}</h5>
    <p className="text-muted mb-3">{description}</p>
    {actionLabel && onAction && (
      <Button variant="outline-primary cursor-pointer" size="md" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);






import type { ButtonProps } from "@/types/buttons";

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
