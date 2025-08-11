import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

// ===========================================
// 🎨 TYPE DEFINITIONS
// ===========================================

export interface GlassPanelProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  /** Variant of glass panel styling */
  variant?: 'primary' | 'secondary' | 'neural' | 'interactive';

  /** Padding size inside the panel */
  padding?: 'none' | 'sm' | 'md' | 'lg';

  /** Border radius size */
  borderRadius?: number | 'sm' | 'md' | 'lg';

  /** Custom glow color for neural variant */
  glowColor?: string;

  /** Content inside the panel */
  children?: React.ReactNode;

  /** Click handler for interactive panels */
  onClick?: () => void;

  /** Additional CSS classes */
  className?: string;

  /** Disable hover animations */
  disableHover?: boolean;

  /** Enable entrance animation */
  animate?: boolean;
}

// ===========================================
// 🎭 GLASS PANEL COMPONENT
// ===========================================

const GlassPanel: React.FC<GlassPanelProps> = ({
  variant = 'primary',
  padding = 'md',
  borderRadius = 'lg',
  glowColor,
  children,
  onClick,
  className = '',
  disableHover = false,
  animate = true,
  ...motionProps
}) => {
  // Base CSS classes for different variants
  const variantClasses = {
    primary: 'glass-panel-primary',
    secondary: 'glass-panel-secondary',
    neural: 'glass-panel-neural',
    interactive: 'glass-panel-interactive',
  };

  // Padding classes
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  // Border radius classes
  const radiusClasses = {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  };

  // Build CSS classes
  const baseClasses = `
    ${variantClasses[variant]}
    ${paddingClasses[padding]}
    ${typeof borderRadius === 'string' ? radiusClasses[borderRadius] : ''}
    ${variant === 'interactive' || onClick ? 'cursor-pointer' : ''}
    ${!disableHover && (variant === 'interactive' || onClick) ? 'hover-enabled' : ''}
    ${className}
  `.trim();

  // Custom styles for border radius number and glow color
  const customStyles: React.CSSProperties = {
    ...(typeof borderRadius === 'number' && { borderRadius: `${borderRadius}px` }),
    ...(glowColor &&
      variant === 'neural' &&
      ({
        '--neural-glow-color': glowColor,
        boxShadow: `0 0 30px ${glowColor}40, 0 0 60px ${glowColor}20`,
      } as React.CSSProperties & Record<string, string>)),
  };

  // Framer Motion variants for entrance animations
  const panelVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    },
    hover: !disableHover
      ? {
          scale: 1.02,
          transition: {
            duration: 0.2,
            ease: 'easeInOut',
          },
        }
      : {},
    tap: onClick
      ? {
          scale: 0.98,
          transition: {
            duration: 0.1,
          },
        }
      : {},
  };

  return (
    <motion.div
      className={baseClasses}
      style={customStyles}
      variants={animate ? panelVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? 'visible' : undefined}
      whileHover={!disableHover && (variant === 'interactive' || onClick) ? 'hover' : undefined}
      whileTap={onClick ? 'tap' : undefined}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default GlassPanel;

// ===========================================
// 🎪 CONVENIENCE COMPONENTS
// ===========================================

/** Primary glass panel with maximum blur effect */
export const PrimaryGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel variant="primary" {...props} />
);

/** Secondary glass panel for less prominent content */
export const SecondaryGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel variant="secondary" {...props} />
);

/** Neural glass panel with glow effects */
export const NeuralGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel variant="neural" {...props} />
);

/** Interactive glass panel with hover effects */
export const InteractiveGlassPanel: React.FC<Omit<GlassPanelProps, 'variant'>> = (props) => (
  <GlassPanel variant="interactive" {...props} />
);

// ===========================================
// 🎯 USAGE EXAMPLES
// ===========================================

/*
// Basic usage
<GlassPanel variant="primary" padding="md">
  <h2>Glass Panel Content</h2>
</GlassPanel>

// Interactive panel with custom styling
<GlassPanel 
  variant="interactive"
  padding="lg"
  borderRadius={24}
  onClick={() => console.log('Clicked!')}
  className="custom-class"
>
  <div>Interactive content</div>
</GlassPanel>

// Neural panel with custom glow
<GlassPanel 
  variant="neural"
  glowColor="#00D4FF"
  padding="md"
  animate={true}
>
  <p>Neural content with cyan glow</p>
</GlassPanel>

// Convenience components
<PrimaryGlassPanel padding="lg">
  Primary content
</PrimaryGlassPanel>

<NeuralGlassPanel glowColor="#7C3AED">
  Neural content
</NeuralGlassPanel>
*/
