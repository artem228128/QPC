import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// ===========================================
// 🎮 TYPE DEFINITIONS
// ===========================================

interface StatDisplayProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: 'primary' | 'health' | 'mana' | 'energy' | 'shield' | 'xp';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glowing?: boolean;
  className?: string;
}

// ===========================================
// 🎮 STAT DISPLAY COMPONENT
// ===========================================

export const StatDisplay: React.FC<StatDisplayProps> = ({
  icon: Icon,
  label,
  value,
  subValue,
  variant = 'primary',
  size = 'md',
  animated = true,
  glowing = true,
  className = '',
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'health':
        return {
          icon: 'text-neon-green',
          value: 'text-neon-green',
          label: 'text-neon-green/80',
          border: 'border-neon-green/30',
          glow: glowing ? 'shadow-[0_0_20px_rgba(0,255,65,0.4)]' : '',
        };
      case 'mana':
        return {
          icon: 'text-neon-purple',
          value: 'text-neon-purple',
          label: 'text-neon-purple/80',
          border: 'border-neon-purple/30',
          glow: glowing ? 'shadow-[0_0_20px_rgba(138,43,226,0.4)]' : '',
        };
      case 'energy':
        return {
          icon: 'text-neon-orange',
          value: 'text-neon-orange',
          label: 'text-neon-orange/80',
          border: 'border-neon-orange/30',
          glow: glowing ? 'shadow-[0_0_20px_rgba(255,149,0,0.4)]' : '',
        };
      case 'shield':
        return {
          icon: 'text-neon-blue',
          value: 'text-neon-blue',
          label: 'text-neon-blue/80',
          border: 'border-neon-blue/30',
          glow: glowing ? 'shadow-[0_0_20px_rgba(0,128,255,0.4)]' : '',
        };
      case 'xp':
        return {
          icon: 'text-neon-lime',
          value: 'text-neon-lime',
          label: 'text-neon-lime/80',
          border: 'border-neon-lime/30',
          glow: glowing ? 'shadow-[0_0_20px_rgba(50,255,50,0.4)]' : '',
        };
      default:
        return {
          icon: 'text-neon-cyan',
          value: 'text-neon-cyan',
          label: 'text-neon-cyan/80',
          border: 'border-neon-cyan/30',
          glow: glowing ? 'shadow-[0_0_20px_rgba(0,255,255,0.4)]' : '',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-2',
          icon: 'w-4 h-4',
          value: 'text-sm',
          label: 'text-xs',
          subValue: 'text-xs',
        };
      case 'lg':
        return {
          container: 'p-4',
          icon: 'w-8 h-8',
          value: 'text-2xl',
          label: 'text-sm',
          subValue: 'text-sm',
        };
      default:
        return {
          container: 'p-3',
          icon: 'w-6 h-6',
          value: 'text-lg',
          label: 'text-xs',
          subValue: 'text-xs',
        };
    }
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <motion.div
      className={`
        relative border font-gaming rounded-lg
        ${variantClasses.border}
        ${variantClasses.glow}
        ${sizeClasses.container}
        ${className}
      `}
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={animated ? { scale: 1.05 } : undefined}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0.5 left-0.5 w-2 h-2 border-l border-t border-current opacity-60" />
      <div className="absolute top-0.5 right-0.5 w-2 h-2 border-r border-t border-current opacity-60" />
      <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-l border-b border-current opacity-60" />
      <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-r border-b border-current opacity-60" />

      {/* Content */}
      <div className="relative z-10 flex items-center space-x-3">
        {/* Icon */}
        <motion.div
          className={`${variantClasses.icon} ${sizeClasses.icon}`}
          animate={
            glowing
              ? {
                  filter: [
                    'drop-shadow(0 0 5px currentColor)',
                    'drop-shadow(0 0 15px currentColor)',
                    'drop-shadow(0 0 5px currentColor)',
                  ],
                }
              : undefined
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="w-full h-full" />
        </motion.div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <div
            className={`font-medium uppercase tracking-wide ${variantClasses.label} ${sizeClasses.label}`}
          >
            {label}
          </div>

          {/* Value */}
          <motion.div
            className={`font-bold font-mono ${variantClasses.value} ${sizeClasses.value}`}
            key={value}
            initial={animated ? { scale: 1.2, opacity: 0.5 } : undefined}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {value}
          </motion.div>

          {/* Sub Value */}
          {subValue && (
            <div className={`font-mono opacity-75 ${variantClasses.label} ${sizeClasses.subValue}`}>
              {subValue}
            </div>
          )}
        </div>
      </div>

      {/* Animated Border Scan */}
      {animated && glowing && (
        <motion.div
          className="absolute inset-0 border border-current rounded opacity-30"
          animate={{
            borderColor: ['rgba(255,255,255,0.1)', 'currentColor', 'rgba(255,255,255,0.1)'],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
};

export default StatDisplay;
