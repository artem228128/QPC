import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Star, Trophy, Target, Crown } from 'lucide-react';

// ===========================================
// 🎮 TYPE DEFINITIONS
// ===========================================

interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked?: boolean;
  progress?: number; // 0-100 for partially completed achievements
  size?: 'sm' | 'md' | 'lg';
  glowing?: boolean;
  className?: string;
}

// ===========================================
// 🎮 ACHIEVEMENT BADGE COMPONENT
// ===========================================

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  description,
  icon,
  rarity = 'common',
  unlocked = false,
  progress,
  size = 'md',
  glowing = true,
  className = '',
}) => {
  // Default icons based on rarity
  const getDefaultIcon = (): LucideIcon => {
    switch (rarity) {
      case 'legendary':
        return Crown;
      case 'epic':
        return Trophy;
      case 'rare':
        return Star;
      default:
        return Target;
    }
  };

  const IconComponent = icon || getDefaultIcon();

  const getRarityClasses = () => {
    switch (rarity) {
      case 'legendary':
        return {
          border: 'border-neon-yellow',
          glow: 'shadow-[0_0_30px_rgba(255,255,0,0.6)]',
          background: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
          icon: 'text-neon-yellow',
          title: 'text-neon-yellow',
          particle: 'bg-neon-yellow',
        };
      case 'epic':
        return {
          border: 'border-neon-purple',
          glow: 'shadow-[0_0_25px_rgba(138,43,226,0.6)]',
          background: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
          icon: 'text-neon-purple',
          title: 'text-neon-purple',
          particle: 'bg-neon-purple',
        };
      case 'rare':
        return {
          border: 'border-neon-blue',
          glow: 'shadow-[0_0_20px_rgba(0,128,255,0.6)]',
          background: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
          icon: 'text-neon-blue',
          title: 'text-neon-blue',
          particle: 'bg-neon-blue',
        };
      default:
        return {
          border: 'border-neon-green',
          glow: 'shadow-[0_0_15px_rgba(0,255,65,0.6)]',
          background: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
          icon: 'text-neon-green',
          title: 'text-neon-green',
          particle: 'bg-neon-green',
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3 w-24 h-24',
          icon: 'w-6 h-6',
          title: 'text-xs',
          description: 'text-xs',
        };
      case 'lg':
        return {
          container: 'p-6 w-40 h-40',
          icon: 'w-12 h-12',
          title: 'text-lg',
          description: 'text-sm',
        };
      default:
        return {
          container: 'p-4 w-32 h-32',
          icon: 'w-8 h-8',
          title: 'text-sm',
          description: 'text-xs',
        };
    }
  };

  const rarityClasses = getRarityClasses();
  const sizeClasses = getSizeClasses();

  return (
    <motion.div
      className={`
        relative border font-gaming text-center rounded-lg
        ${rarityClasses.border}
        ${unlocked && glowing ? rarityClasses.glow : ''}
        ${sizeClasses.container}
        ${!unlocked ? 'opacity-50 grayscale' : ''}
        ${className}
      `}
      style={{
        background: unlocked ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        ...(unlocked && glowing
          ? {
              boxShadow: [
                '0 0 20px currentColor',
                '0 0 40px currentColor',
                '0 0 20px currentColor',
              ],
            }
          : {}),
      }}
      transition={{
        duration: 0.5,
        ease: 'easeOut',
        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.05, rotate: 5 }}
    >
      {/* Corner Brackets */}
      <div className="absolute top-1 left-1 w-3 h-3 border-l-2 border-t-2 border-current opacity-80" />
      <div className="absolute top-1 right-1 w-3 h-3 border-r-2 border-t-2 border-current opacity-80" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-l-2 border-b-2 border-current opacity-80" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-current opacity-80" />

      {/* Floating Particles for Legendary */}
      {unlocked && rarity === 'legendary' && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${rarityClasses.particle} rounded-full`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [-10, -20, -10],
                opacity: [0.5, 1, 0.5],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-2">
        {/* Icon */}
        <motion.div
          className={`${rarityClasses.icon} ${sizeClasses.icon}`}
          animate={
            unlocked && glowing
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
          <IconComponent className="w-full h-full" />
        </motion.div>

        {/* Title */}
        <div
          className={`font-bold uppercase tracking-wide ${rarityClasses.title} ${sizeClasses.title}`}
        >
          {title}
        </div>

        {/* Description */}
        {description && (
          <div className={`text-white/70 leading-tight ${sizeClasses.description}`}>
            {description}
          </div>
        )}

        {/* Progress Bar for Partial Completion */}
        {progress !== undefined && progress < 100 && (
          <div className="w-full mt-2">
            <div className="w-full h-1 bg-black/50 border border-current/30 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${rarityClasses.background}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="text-xs text-white/60 mt-1">{Math.round(progress)}%</div>
          </div>
        )}
      </div>

      {/* Unlock Animation */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 border-2 border-current rounded"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      )}

      {/* Rarity Indicator */}
      <div className="absolute -top-1 -right-1">
        <div className={`w-3 h-3 ${rarityClasses.particle} rounded-full animate-neon-pulse`} />
      </div>
    </motion.div>
  );
};

export default AchievementBadge;
