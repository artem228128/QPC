import React from 'react';
import { motion } from 'framer-motion';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

interface NeuralButtonProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

// ===========================================
// 🧠 NEURAL BUTTON COMPONENT
// ===========================================

export const NeuralButton: React.FC<NeuralButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-neural-cyan text-white',
    secondary: 'bg-neural-purple text-white',
  };

  return (
    <motion.button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        font-semibold rounded-lg transition-all duration-200
        hover:shadow-lg hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {loading ? 'Loading...' : children}
    </motion.button>
  );
};

export default NeuralButton;
