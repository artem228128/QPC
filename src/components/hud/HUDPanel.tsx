import React from 'react';
import { motion } from 'framer-motion';

// ===========================================
// 🎮 TYPE DEFINITIONS
// ===========================================

interface HUDPanelProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'health' | 'mana' | 'energy' | 'shield' | 'terminal';
  glitch?: boolean;
  scanlines?: boolean;
  style?: React.CSSProperties;
}

// ===========================================
// 🎮 HUD PANEL COMPONENT
// ===========================================

export const HUDPanel: React.FC<HUDPanelProps> = ({
  className = '',
  children,
  variant = 'primary',
  glitch = false,
  scanlines = true,
  style = {},
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'health':
        return 'hud-panel-health';
      case 'mana':
        return 'hud-panel-mana';
      case 'energy':
        return 'hud-panel-energy';
      case 'shield':
        return 'hud-panel border-neon-blue';
      case 'terminal':
        return 'hud-panel border-neon-green bg-black font-mono';
      default:
        return 'hud-panel';
    }
  };

  return (
    <motion.div
      className={`
        relative rounded-lg p-4 backdrop-blur-sm
        ${getVariantClasses()}
        ${glitch ? 'animate-glitch' : ''}
        ${className}
      `}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(0, 255, 255, 0.3)',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(4px)',
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Scanlines Effect */}
      {scanlines && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.1)_2px,rgba(0,255,255,0.1)_4px)]" />
        </div>
      )}

      {/* Corner Brackets */}
      <div className="absolute top-1 left-1 w-3 h-3 border-l border-t border-current opacity-60" />
      <div className="absolute top-1 right-1 w-3 h-3 border-r border-t border-current opacity-60" />
      <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b border-current opacity-60" />
      <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b border-current opacity-60" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default HUDPanel;
