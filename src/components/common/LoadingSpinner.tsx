import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'purple' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'cyan',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colorClasses = {
    cyan: 'border-cyan-400 border-t-transparent',
    purple: 'border-purple-400 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div
      className={`
        loading-spinner
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `.trim()}
    />
  );
};

export default LoadingSpinner;
