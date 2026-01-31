import React from 'react';
import type { ZoomSpinnerProps } from '@/types/loading';

const sizeClassMap = {
  sm: 'spinner-grow-sm',
  md: '',
  lg: 'spinner-grow-lg',
};

const ZoomSpinner: React.FC<Omit<ZoomSpinnerProps, 'size'> & { size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'sm',
  className = '',
  text = 'Loading...',
}) => {
  return (
    <div className={`d-flex align-items-center`}>
      <div
        className={`spinner-grow ${sizeClassMap[size]} me-2 mt-2 text-primary ${className}`}
        role="status"
      >
        <span className="visually-hidden">{text}</span>
      </div>
      <span className="mt-2">{text}</span>
    </div>
  );
};

export default ZoomSpinner;
