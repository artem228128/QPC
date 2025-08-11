import React from 'react';
import { motion } from 'framer-motion';

// ===========================================
// 🎮 TYPE DEFINITIONS
// ===========================================

interface ProgressBarProps {
  value: number; // 0-100
  maxValue?: number;
  label?: string;
  variant?: 'health' | 'mana' | 'xp' | 'energy' | 'shield';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

// ===========================================
// 🎮 PROGRESS BAR COMPONENT
// ===========================================

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue = 100,
  label,
  variant = 'health',
  size = 'md',
  showText = true,
  animated = true,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / maxValue) * 100, 0), 100);

  const getVariantClasses = () => {
    switch (variant) {
      case 'health':
        return {
          container: 'border-neon-green',
          fill: 'bg-gradient-to-r from-neon-green to-green-400',
          glow: 'shadow-[0_0_10px_rgba(0,255,65,0.6)]',
          text: 'text-neon-green',
        };
      case 'mana':
        return {
          container: 'border-neon-purple',
          fill: 'bg-gradient-to-r from-neon-purple to-purple-400',
          glow: 'shadow-[0_0_10px_rgba(138,43,226,0.6)]',
          text: 'text-neon-purple',
        };
      case 'xp':
        return {
          container: 'border-neon-lime',
          fill: 'bg-gradient-to-r from-neon-lime to-lime-400',
          glow: 'shadow-[0_0_10px_rgba(50,255,50,0.6)]',
          text: 'text-neon-lime',
        };
      case 'energy':
        return {
          container: 'border-neon-orange',
          fill: 'bg-gradient-to-r from-neon-orange to-orange-400',
          glow: 'shadow-[0_0_10px_rgba(255,149,0,0.6)]',
          text: 'text-neon-orange',
        };
      case 'shield':
        return {
          container: 'border-neon-blue',
          fill: 'bg-gradient-to-r from-neon-blue to-blue-400',
          glow: 'shadow-[0_0_10px_rgba(0,128,255,0.6)]',
          text: 'text-neon-blue',
        };
      default:
        return {
          container: 'border-neon-cyan',
          fill: 'bg-gradient-to-r from-neon-cyan to-cyan-400',
          glow: 'shadow-[0_0_10px_rgba(0,255,255,0.6)]',
          text: 'text-neon-cyan',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'h-2',
          text: 'text-xs',
        };
      case 'lg':
        return {
          container: 'h-6',
          text: 'text-sm',
        };
      default:
        return {
          container: 'h-4',
          text: 'text-xs',
        };
    }
  };

  const variantClasses = getVariantClasses();
  const sizeClasses = getSizeClasses();

  return (
    <div className={`font-gaming ${className}`}>
      {/* Label */}
      {label && (
        <div className={`mb-1 font-semibold ${variantClasses.text} ${sizeClasses.text}`}>
          {label}
        </div>
      )}

      {/* Progress Container */}
      <div
        className={`
          relative w-full bg-black/50 border
          ${variantClasses.container}
          ${sizeClasses.container}
          ${variantClasses.glow}
          overflow-hidden
        `}
        style={{ borderRadius: '2px' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_6px)]" />
        </div>

        {/* Progress Fill */}
        <motion.div
          className={`
            h-full relative overflow-hidden
            ${variantClasses.fill}
            ${animated ? 'transition-all duration-300 ease-out' : ''}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        >
          {/* Fill Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Animated Scan Effect */}
          {animated && percentage > 0 && (
            <motion.div
              className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ['0%', '100%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>

        {/* Progress Text */}
        {showText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-bold text-shadow-lg ${sizeClasses.text}`}>
              {Math.round(value)}/{maxValue}
            </span>
          </div>
        )}
      </div>

      {/* Percentage Display */}
      {showText && (
        <div className={`mt-1 text-right ${variantClasses.text} ${sizeClasses.text} font-mono`}>
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
