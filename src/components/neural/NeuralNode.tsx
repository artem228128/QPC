import React, { useState } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

export interface NeuralNodeProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  /** Size of the neural node */
  size?: 'small' | 'medium' | 'large';

  /** Status of the node affecting animation and appearance */
  status?: 'active' | 'pending' | 'inactive' | 'pulsing';

  /** Color theme of the node */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

  /** Custom color override */
  customColor?: string;

  /** Click handler */
  onClick?: () => void;

  /** Disable hover effects */
  disableHover?: boolean;

  /** Disable click ripple effect */
  disableRipple?: boolean;

  /** Additional CSS classes */
  className?: string;

  /** Show connection points around the node */
  showConnectionPoints?: boolean;

  /** Custom glow intensity (0-1) */
  glowIntensity?: number;
}

// ===========================================
// 🧠 NEURAL NODE COMPONENT
// ===========================================

const NeuralNode: React.FC<NeuralNodeProps> = ({
  size = 'medium',
  status = 'inactive',
  color = 'primary',
  customColor,
  onClick,
  disableHover = false,
  disableRipple = false,
  className = '',
  showConnectionPoints = false,
  glowIntensity = 1,
  ...motionProps
}) => {
  const [isRippling, setIsRippling] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: {
      size: 8,
      glowRadius: 16,
      connectionPointSize: 2,
    },
    medium: {
      size: 12,
      glowRadius: 24,
      connectionPointSize: 3,
    },
    large: {
      size: 16,
      glowRadius: 32,
      connectionPointSize: 4,
    },
  };

  // Color configurations
  const colorConfig = {
    primary: '#00D4FF', // Cyan
    secondary: '#7C3AED', // Purple
    accent: '#06FFA5', // Mint
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
  };

  const currentSize = sizeConfig[size];
  const currentColor = customColor || colorConfig[color];

  // Handle click with ripple effect
  const handleClick = () => {
    if (onClick) {
      onClick();

      if (!disableRipple) {
        setIsRippling(true);
        setTimeout(() => setIsRippling(false), 400);
      }
    }
  };

  // Animation variants for different states
  const nodeVariants: Variants = {
    inactive: {
      scale: 1,
      opacity: 0.4,
      boxShadow: `0 0 0 ${currentColor}00`,
    },
    pending: {
      scale: 1,
      opacity: 0.7,
      boxShadow: `0 0 ${currentSize.glowRadius * 0.5}px ${currentColor}40`,
    },
    active: {
      scale: 1,
      opacity: 1,
      boxShadow: `0 0 ${currentSize.glowRadius * glowIntensity}px ${currentColor}60, 0 0 ${currentSize.glowRadius * 2 * glowIntensity}px ${currentColor}30`,
    },
    pulsing: {
      scale: [1, 1.2, 1],
      opacity: [0.8, 1, 0.8],
      boxShadow: [
        `0 0 ${currentSize.glowRadius * 0.8}px ${currentColor}40`,
        `0 0 ${currentSize.glowRadius * 1.5}px ${currentColor}80, 0 0 ${currentSize.glowRadius * 3}px ${currentColor}40`,
        `0 0 ${currentSize.glowRadius * 0.8}px ${currentColor}40`,
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Ripple animation
  const rippleVariants: Variants = {
    hidden: {
      scale: 0,
      opacity: 0.8,
    },
    visible: {
      scale: 3,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  // Connection points positions (top, right, bottom, left)
  const connectionPoints = [
    { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' },
    { top: '50%', right: '0%', transform: 'translate(50%, -50%)' },
    { bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)' },
    { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' },
  ];

  return (
    <div className={`neural-node-container relative ${className}`}>
      {/* Main Node */}
      <motion.div
        className={`neural-node ${onClick ? 'cursor-pointer' : ''}`}
        style={{
          width: currentSize.size,
          height: currentSize.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${currentColor}FF 0%, ${currentColor}CC 50%, ${currentColor}88 100%)`,
          border: `1px solid ${currentColor}AA`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        variants={nodeVariants}
        initial={status}
        animate={status}
        whileHover={!disableHover ? { scale: 1.3 } : undefined}
        whileTap={onClick ? { scale: 0.9 } : undefined}
        onClick={handleClick}
        {...motionProps}
      >
        {/* Ripple Effect */}
        {isRippling && !disableRipple && (
          <motion.div
            className="neural-node-ripple absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: `2px solid ${currentColor}60`,
              backgroundColor: 'transparent',
            }}
            variants={rippleVariants}
            initial="hidden"
            animate="visible"
          />
        )}

        {/* Inner Core */}
        <motion.div
          className="neural-node-core"
          style={{
            width: currentSize.size * 0.4,
            height: currentSize.size * 0.4,
            borderRadius: '50%',
            background: currentColor,
            opacity: status === 'active' || status === 'pulsing' ? 1 : 0.6,
          }}
          animate={{
            opacity: status === 'pulsing' ? [0.6, 1, 0.6] : undefined,
          }}
          transition={{
            duration: 1.5,
            repeat: status === 'pulsing' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Connection Points */}
      {showConnectionPoints && (
        <div className="neural-node-connections absolute inset-0">
          {connectionPoints.map((point, index) => (
            <motion.div
              key={index}
              className="neural-connection-point absolute rounded-full"
              style={{
                width: currentSize.connectionPointSize,
                height: currentSize.connectionPointSize,
                backgroundColor: currentColor,
                ...point,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NeuralNode;

// ===========================================
// 🎪 CONVENIENCE COMPONENTS
// ===========================================

/** Small neural node for dense layouts */
export const SmallNeuralNode: React.FC<Omit<NeuralNodeProps, 'size'>> = (props) => (
  <NeuralNode size="small" {...props} />
);

/** Medium neural node (default size) */
export const MediumNeuralNode: React.FC<Omit<NeuralNodeProps, 'size'>> = (props) => (
  <NeuralNode size="medium" {...props} />
);

/** Large neural node for emphasis */
export const LargeNeuralNode: React.FC<Omit<NeuralNodeProps, 'size'>> = (props) => (
  <NeuralNode size="large" {...props} />
);

/** Active pulsing neural node */
export const PulsingNeuralNode: React.FC<Omit<NeuralNodeProps, 'status'>> = (props) => (
  <NeuralNode status="pulsing" {...props} />
);

/** Interactive neural node with click handler */
export const InteractiveNeuralNode: React.FC<NeuralNodeProps> = (props) => (
  <NeuralNode showConnectionPoints onClick={props.onClick} {...props} />
);

// ===========================================
// 🎯 USAGE EXAMPLES
// ===========================================

/*
// Basic usage
<NeuralNode 
  size="medium" 
  status="active" 
  color="primary" 
/>

// Pulsing node with custom color
<NeuralNode 
  size="large"
  status="pulsing"
  customColor="#FF6B6B"
  glowIntensity={1.5}
/>

// Interactive node with click handler
<NeuralNode 
  size="medium"
  status="active"
  color="accent"
  showConnectionPoints
  onClick={() => console.log('Node clicked!')}
/>

// Convenience components
<PulsingNeuralNode color="secondary" size="large" />
<InteractiveNeuralNode 
  color="primary" 
  onClick={handleNodeClick}
  className="my-custom-class"
/>
*/
