import React from 'react';

interface GlassButtonProps {
  variant?: 'primary' | 'secondary' | 'neural';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  glow?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  disabled = false,
  loading = false,
  glow = false,
  onClick,
  children,
  className = '',
}) => {
  const baseClasses = 'glass-button transition-all';

  const variantClasses = {
    primary: 'glass-button-primary',
    secondary: 'glass-button',
    neural: 'glass-neural',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${glow ? 'neural-glow' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${loading ? 'animate-pulse' : ''}
    ${className}
  `.trim();

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled || loading}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="loading-spinner w-4 h-4 mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default GlassButton;
