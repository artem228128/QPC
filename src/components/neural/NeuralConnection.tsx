import React, { useEffect, useState } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

export interface NeuralConnectionProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  /** Direction of the connection line */
  direction?: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down';

  /** Length of the connection in pixels */
  length?: number;

  /** Thickness of the connection line */
  thickness?: 'thin' | 'medium' | 'thick' | number;

  /** Color theme of the connection */
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';

  /** Custom color override */
  customColor?: string;

  /** Enable animated data flow particles */
  dataFlow?: boolean;

  /** Speed of data flow animation (1 = normal, 2 = fast, 0.5 = slow) */
  flowSpeed?: number;

  /** Number of data particles flowing */
  particleCount?: number;

  /** Status affecting appearance and animation */
  status?: 'active' | 'inactive' | 'transmitting' | 'error';

  /** Glow intensity (0-1) */
  glowIntensity?: number;

  /** Enable pulse animation along the line */
  pulse?: boolean;

  /** Custom animation duration in seconds */
  animationDuration?: number;

  /** Additional CSS classes */
  className?: string;
}

interface DataParticle {
  id: number;
  progress: number;
  delay: number;
}

// ===========================================
// 🔗 NEURAL CONNECTION COMPONENT
// ===========================================

const NeuralConnection: React.FC<NeuralConnectionProps> = ({
  direction = 'horizontal',
  length = 100,
  thickness = 'medium',
  color = 'primary',
  customColor,
  dataFlow = false,
  flowSpeed = 1,
  particleCount = 3,
  status = 'active',
  glowIntensity = 0.8,
  pulse: _pulse = false,
  animationDuration = 2,
  className = '',
  ..._motionProps
}) => {
  const [particles, setParticles] = useState<DataParticle[]>([]);

  // Color configurations
  const colorConfig = {
    primary: '#00D4FF', // Cyan
    secondary: '#7C3AED', // Purple
    accent: '#06FFA5', // Mint
    success: '#10B981', // Green
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
  };

  // Thickness configurations
  const thicknessConfig = {
    thin: 1,
    medium: 2,
    thick: 3,
  };

  const currentColor = customColor || colorConfig[color];
  const currentThickness = typeof thickness === 'number' ? thickness : thicknessConfig[thickness];

  // Direction configurations
  const directionConfig = {
    horizontal: {
      width: length,
      height: currentThickness,
      transform: 'rotate(0deg)',
    },
    vertical: {
      width: currentThickness,
      height: length,
      transform: 'rotate(0deg)',
    },
    'diagonal-up': {
      width: length,
      height: currentThickness,
      transform: 'rotate(-45deg)',
      transformOrigin: 'left center',
    },
    'diagonal-down': {
      width: length,
      height: currentThickness,
      transform: 'rotate(45deg)',
      transformOrigin: 'left center',
    },
  };

  // Initialize data particles
  useEffect(() => {
    if (dataFlow && status === 'transmitting') {
      const newParticles: DataParticle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          progress: 0,
          delay: (i * animationDuration * 1000) / particleCount,
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [dataFlow, status, particleCount, animationDuration]);

  // Status-based styling
  const getStatusStyles = () => {
    const baseOpacity = {
      active: 1,
      inactive: 0.3,
      transmitting: 1,
      error: 0.8,
    };

    const baseGlow = glowIntensity * (status === 'error' ? 1.5 : 1);

    return {
      opacity: baseOpacity[status],
      boxShadow:
        status !== 'inactive'
          ? `0 0 ${4 * baseGlow}px ${currentColor}60, 0 0 ${8 * baseGlow}px ${currentColor}30`
          : 'none',
      filter: status === 'error' ? 'hue-rotate(180deg)' : 'none',
    };
  };

  // Line animation variants
  const lineVariants: Variants = {
    inactive: {
      opacity: 0.3,
      boxShadow: 'none',
    },
    active: {
      opacity: 1,
      boxShadow: `0 0 ${4 * glowIntensity}px ${currentColor}60, 0 0 ${8 * glowIntensity}px ${currentColor}30`,
    },
    transmitting: {
      opacity: 1,
      boxShadow: [
        `0 0 ${4 * glowIntensity}px ${currentColor}60, 0 0 ${8 * glowIntensity}px ${currentColor}30`,
        `0 0 ${6 * glowIntensity}px ${currentColor}80, 0 0 ${12 * glowIntensity}px ${currentColor}50`,
        `0 0 ${4 * glowIntensity}px ${currentColor}60, 0 0 ${8 * glowIntensity}px ${currentColor}30`,
      ],
      transition: {
        duration: animationDuration,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Data particle animation
  const particleVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0],
      transition: {
        duration: animationDuration / flowSpeed,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  // Calculate particle position based on direction
  const getParticlePosition = (progress: number) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    switch (direction) {
      case 'horizontal':
        return { left: `${clampedProgress}%`, top: '50%', transform: 'translate(-50%, -50%)' };
      case 'vertical':
        return { top: `${clampedProgress}%`, left: '50%', transform: 'translate(-50%, -50%)' };
      case 'diagonal-up':
      case 'diagonal-down':
        return { left: `${clampedProgress}%`, top: '50%', transform: 'translate(-50%, -50%)' };
      default:
        return { left: '0%', top: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className={`neural-connection-container relative ${className}`}>
      {/* Main Connection Line */}
      <motion.div
        className="neural-connection-line"
        style={{
          ...directionConfig[direction],
          background: `linear-gradient(90deg, ${currentColor}AA, ${currentColor}FF, ${currentColor}AA)`,
          border: `0.5px solid ${currentColor}CC`,
          borderRadius: currentThickness / 2,
          position: 'relative',
          ...getStatusStyles(),
        }}
        variants={lineVariants}
        initial={status}
        animate={status}
      >
        {/* Background Glow */}
        <div
          className="neural-connection-glow absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentColor}40, transparent)`,
            borderRadius: currentThickness / 2,
            filter: `blur(${currentThickness * 2}px)`,
            transform: 'scale(2)',
          }}
        />
      </motion.div>

      {/* Data Flow Particles */}
      {dataFlow && status === 'transmitting' && (
        <div className="neural-data-particles absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="neural-data-particle absolute rounded-full"
              style={{
                width: currentThickness * 2,
                height: currentThickness * 2,
                background: `radial-gradient(circle, ${currentColor}FF, ${currentColor}AA)`,
                boxShadow: `0 0 ${currentThickness * 4}px ${currentColor}80`,
                ...getParticlePosition(0),
              }}
              variants={particleVariants}
              initial="hidden"
              animate={{
                ...getParticlePosition(100),
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
              }}
              transition={{
                delay: particle.delay / 1000,
                duration: animationDuration / flowSpeed,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Connection Endpoints */}
      <div className="neural-connection-endpoints">
        {/* Start Point */}
        <motion.div
          className="neural-endpoint start absolute rounded-full"
          style={{
            width: currentThickness * 3,
            height: currentThickness * 3,
            background: currentColor,
            boxShadow: `0 0 ${currentThickness * 2}px ${currentColor}60`,
            top: '50%',
            left: direction === 'vertical' ? '50%' : '0%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: status === 'transmitting' ? [1, 1.2, 1] : 1,
            opacity: status === 'inactive' ? 0.3 : 1,
          }}
          transition={{
            duration: animationDuration,
            repeat: status === 'transmitting' ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />

        {/* End Point */}
        <motion.div
          className="neural-endpoint end absolute rounded-full"
          style={{
            width: currentThickness * 3,
            height: currentThickness * 3,
            background: currentColor,
            boxShadow: `0 0 ${currentThickness * 2}px ${currentColor}60`,
            top: direction === 'vertical' ? '100%' : '50%',
            left: direction === 'vertical' ? '50%' : '100%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: status === 'transmitting' ? [1, 1.2, 1] : 1,
            opacity: status === 'inactive' ? 0.3 : 1,
          }}
          transition={{
            duration: animationDuration,
            repeat: status === 'transmitting' ? Infinity : 0,
            ease: 'easeInOut',
            delay: status === 'transmitting' ? animationDuration / 2 : 0,
          }}
        />
      </div>
    </div>
  );
};

export default NeuralConnection;

// ===========================================
// 🎪 CONVENIENCE COMPONENTS
// ===========================================

/** Horizontal neural connection */
export const HorizontalConnection: React.FC<Omit<NeuralConnectionProps, 'direction'>> = (props) => (
  <NeuralConnection direction="horizontal" {...props} />
);

/** Vertical neural connection */
export const VerticalConnection: React.FC<Omit<NeuralConnectionProps, 'direction'>> = (props) => (
  <NeuralConnection direction="vertical" {...props} />
);

/** Diagonal neural connection going up */
export const DiagonalUpConnection: React.FC<Omit<NeuralConnectionProps, 'direction'>> = (props) => (
  <NeuralConnection direction="diagonal-up" {...props} />
);

/** Diagonal neural connection going down */
export const DiagonalDownConnection: React.FC<Omit<NeuralConnectionProps, 'direction'>> = (
  props
) => <NeuralConnection direction="diagonal-down" {...props} />;

/** Animated data flow connection */
export const DataFlowConnection: React.FC<Omit<NeuralConnectionProps, 'dataFlow' | 'status'>> = (
  props
) => <NeuralConnection dataFlow status="transmitting" {...props} />;

/** Pulsing neural connection */
export const PulsingConnection: React.FC<Omit<NeuralConnectionProps, 'pulse'>> = (props) => (
  <NeuralConnection pulse {...props} />
);

// ===========================================
// 🎯 USAGE EXAMPLES
// ===========================================

/*
// Basic horizontal connection
<NeuralConnection 
  direction="horizontal"
  length={200}
  thickness="medium"
  color="primary"
  status="active"
/>

// Animated data flow
<NeuralConnection 
  direction="diagonal-up"
  length={150}
  thickness="thick"
  color="accent"
  status="transmitting"
  dataFlow
  particleCount={5}
  flowSpeed={1.5}
/>

// Pulsing connection
<NeuralConnection 
  direction="vertical"
  length={100}
  color="secondary"
  pulse
  glowIntensity={1.2}
/>

// Convenience components
<DataFlowConnection 
  length={250}
  color="primary"
  particleCount={3}
  flowSpeed={2}
/>

<PulsingConnection 
  direction="horizontal"
  length={180}
  color="accent"
  animationDuration={3}
/>
*/
