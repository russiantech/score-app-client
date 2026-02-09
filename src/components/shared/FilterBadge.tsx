import type { FilterBadgeProps } from "@/types/utils";

export const FilterBadge: React.FC<FilterBadgeProps> = ({ children, onRemove, icon, color = 'primary' }) => (
  <span className={`badge bg-${color} rounded-pill d-inline-flex align-items-center`}>
    {icon && <i className={`${icon} me-1`} />}
    <span className="text-truncate" style={{ maxWidth: '150px' }}>
      {children}
    </span>
    <button
      type="button"
      className="btn-close btn-close-white ms-2"
      style={{ fontSize: '0.5rem', padding: '0.25rem' }}
      onClick={onRemove}
      aria-label="Remove filter"
    />
  </span>
);

